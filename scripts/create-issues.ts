#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LabelDef {
  readonly name: string;
  readonly color: string;
  readonly description?: string;
}

interface MilestoneDef {
  readonly title: string;
  readonly description?: string;
  readonly due_on?: string;
}

interface IssueDef {
  readonly title: string;
  readonly body?: string;
  readonly labels?: readonly string[];
  readonly milestone?: string;
  readonly assignees?: readonly string[];
}

interface Backlog {
  readonly labels?: readonly LabelDef[];
  readonly milestones?: readonly MilestoneDef[];
  readonly issues: readonly IssueDef[];
}

interface GhLabel {
  readonly name: string;
}

interface GhMilestone {
  readonly title: string;
  readonly number: number;
}

interface GhIssue {
  readonly title: string;
  readonly number: number;
}

// ---------------------------------------------------------------------------
// Config — fail fast on missing env vars
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[ERROR] Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

const GITHUB_TOKEN = requireEnv('GITHUB_TOKEN');
const GITHUB_OWNER = requireEnv('GITHUB_OWNER');
const GITHUB_REPO = requireEnv('GITHUB_REPO');
const DRY_RUN = process.argv.includes('--dry-run');
const BASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

// ---------------------------------------------------------------------------
// GitHub REST client
// ---------------------------------------------------------------------------

async function ghFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GitHub API ${response.status} ${response.statusText} [${path}]: ${body}`
    );
  }

  return response.json() as Promise<T>;
}

async function fetchAllPages<T>(path: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  const sep = path.includes('?') ? '&' : '?';
  while (true) {
    const items = await ghFetch<T[]>(`${path}${sep}per_page=100&page=${page}`);
    results.push(...items);
    if (items.length < 100) break;
    page++;
  }
  return results;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

async function ensureLabels(labels: readonly LabelDef[]): Promise<void> {
  if (labels.length === 0) return;

  const existing = await fetchAllPages<GhLabel>('/labels');
  const existingNames = new Set(existing.map((l) => l.name.toLowerCase()));

  for (const label of labels) {
    if (existingNames.has(label.name.toLowerCase())) {
      console.log(`[SKIP]    Label already exists: ${label.name}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`[DRY-RUN] Would create label: ${label.name}`);
      continue;
    }
    await ghFetch('/labels', { method: 'POST', body: JSON.stringify(label) });
    console.log(`[CREATE]  Label created: ${label.name}`);
  }
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

async function ensureMilestones(
  milestones: readonly MilestoneDef[]
): Promise<Map<string, number>> {
  const milestoneMap = new Map<string, number>();
  if (milestones.length === 0) return milestoneMap;

  const existing = await fetchAllPages<GhMilestone>('/milestones?state=all');
  for (const m of existing) milestoneMap.set(m.title, m.number);

  for (const ms of milestones) {
    if (milestoneMap.has(ms.title)) {
      console.log(`[SKIP]    Milestone already exists: ${ms.title}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`[DRY-RUN] Would create milestone: ${ms.title}`);
      continue;
    }
    const created = await ghFetch<GhMilestone>('/milestones', {
      method: 'POST',
      body: JSON.stringify(ms),
    });
    milestoneMap.set(created.title, created.number);
    console.log(`[CREATE]  Milestone created: ${ms.title}`);
  }

  return milestoneMap;
}

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

async function ensureIssues(
  issues: readonly IssueDef[],
  milestoneMap: Map<string, number>
): Promise<void> {
  const existing = await fetchAllPages<GhIssue>('/issues?state=all');
  const existingTitles = new Set(existing.map((i) => i.title.toLowerCase()));

  let created = 0;
  let skipped = 0;

  for (const issue of issues) {
    if (existingTitles.has(issue.title.toLowerCase())) {
      console.log(`[SKIP]    Issue already exists: "${issue.title}"`);
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`[DRY-RUN] Would create issue: "${issue.title}"`);
      continue;
    }

    const payload: Record<string, unknown> = {
      title: issue.title,
      body: issue.body ?? '',
      labels: issue.labels ?? [],
      assignees: issue.assignees ?? [],
    };

    if (issue.milestone !== undefined && milestoneMap.has(issue.milestone)) {
      payload['milestone'] = milestoneMap.get(issue.milestone);
    }

    const gh = await ghFetch<GhIssue>('/issues', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    console.log(`[CREATE]  Issue #${gh.number} created: "${issue.title}"`);
    created++;
  }

  if (!DRY_RUN) {
    console.log(`\nDone. ${created} created, ${skipped} skipped.`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const backlogPath = resolve(__dirname, 'backlog.json');
  const backlog = JSON.parse(readFileSync(backlogPath, 'utf8')) as Backlog;

  if (DRY_RUN) console.log('[DRY-RUN] No changes will be made.\n');
  console.log(`Target: ${GITHUB_OWNER}/${GITHUB_REPO}\n`);

  console.log('--- Labels ---');
  await ensureLabels(backlog.labels ?? []);

  console.log('\n--- Milestones ---');
  const milestoneMap = await ensureMilestones(backlog.milestones ?? []);

  console.log('\n--- Issues ---');
  await ensureIssues(backlog.issues, milestoneMap);
}

main().catch((err: unknown) => {
  console.error('[ERROR]', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
