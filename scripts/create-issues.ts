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

const GITHUB_TOKEN        = requireEnv('GITHUB_TOKEN');
const GITHUB_OWNER        = requireEnv('GITHUB_OWNER');
const GITHUB_FRONTEND_REPO = requireEnv('GITHUB_FRONTEND_REPO'); // e.g. HRIS
const GITHUB_BACKEND_REPO  = requireEnv('GITHUB_BACKEND_REPO');  // e.g. hr-backend
const DRY_RUN = process.argv.includes('--dry-run');

const FRONTEND_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_FRONTEND_REPO}`;
const BACKEND_BASE  = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_BACKEND_REPO}`;

// ---------------------------------------------------------------------------
// GitHub REST client
// ---------------------------------------------------------------------------

async function ghFetch<T>(baseUrl: string, path: string, options: RequestInit = {}): Promise<T> {
  const url = `${baseUrl}${path}`;
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

async function fetchAllPages<T>(baseUrl: string, path: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  const sep = path.includes('?') ? '&' : '?';
  while (true) {
    const items = await ghFetch<T[]>(baseUrl, `${path}${sep}per_page=100&page=${page}`);
    results.push(...items);
    if (items.length < 100) break;
    page++;
  }
  return results;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

async function ensureLabels(
  baseUrl: string,
  repoName: string,
  labels: readonly LabelDef[]
): Promise<void> {
  if (labels.length === 0) return;

  const existing = await fetchAllPages<GhLabel>(baseUrl, '/labels');
  const existingNames = new Set(existing.map((l) => l.name.toLowerCase()));

  for (const label of labels) {
    if (existingNames.has(label.name.toLowerCase())) {
      console.log(`[SKIP]    [${repoName}] Label already exists: ${label.name}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`[DRY-RUN] [${repoName}] Would create label: ${label.name}`);
      continue;
    }
    await ghFetch(baseUrl, '/labels', { method: 'POST', body: JSON.stringify(label) });
    console.log(`[CREATE]  [${repoName}] Label created: ${label.name}`);
  }
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

async function ensureMilestones(
  baseUrl: string,
  repoName: string,
  milestones: readonly MilestoneDef[]
): Promise<Map<string, number>> {
  const milestoneMap = new Map<string, number>();
  if (milestones.length === 0) return milestoneMap;

  const existing = await fetchAllPages<GhMilestone>(baseUrl, '/milestones?state=all');
  for (const m of existing) milestoneMap.set(m.title, m.number);

  for (const ms of milestones) {
    if (milestoneMap.has(ms.title)) {
      console.log(`[SKIP]    [${repoName}] Milestone already exists: ${ms.title}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`[DRY-RUN] [${repoName}] Would create milestone: ${ms.title}`);
      continue;
    }
    const created = await ghFetch<GhMilestone>(baseUrl, '/milestones', {
      method: 'POST',
      body: JSON.stringify(ms),
    });
    milestoneMap.set(created.title, created.number);
    console.log(`[CREATE]  [${repoName}] Milestone created: ${ms.title}`);
  }

  return milestoneMap;
}

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

interface RepoTarget {
  baseUrl: string;
  name: string;
  milestoneMap: Map<string, number>;
}

async function createIssueInRepo(
  target: RepoTarget,
  issue: IssueDef,
  existingTitles: Set<string>
): Promise<'created' | 'skipped'> {
  if (existingTitles.has(issue.title.toLowerCase())) {
    console.log(`[SKIP]    [${target.name}] Issue already exists: "${issue.title}"`);
    return 'skipped';
  }

  if (DRY_RUN) {
    console.log(`[DRY-RUN] [${target.name}] Would create issue: "${issue.title}"`);
    return 'skipped';
  }

  const payload: Record<string, unknown> = {
    title: issue.title,
    body: issue.body ?? '',
    labels: issue.labels ?? [],
    assignees: issue.assignees ?? [],
  };

  if (issue.milestone !== undefined && target.milestoneMap.has(issue.milestone)) {
    payload['milestone'] = target.milestoneMap.get(issue.milestone);
  }

  const gh = await ghFetch<GhIssue>(target.baseUrl, '/issues', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  console.log(`[CREATE]  [${target.name}] Issue #${gh.number} created: "${issue.title}"`);
  return 'created';
}

async function ensureIssues(
  issues: readonly IssueDef[],
  frontend: RepoTarget,
  backend: RepoTarget
): Promise<void> {
  const [frontendExisting, backendExisting] = await Promise.all([
    fetchAllPages<GhIssue>(frontend.baseUrl, '/issues?state=all'),
    fetchAllPages<GhIssue>(backend.baseUrl, '/issues?state=all'),
  ]);

  const frontendTitles = new Set(frontendExisting.map((i) => i.title.toLowerCase()));
  const backendTitles  = new Set(backendExisting.map((i) => i.title.toLowerCase()));

  let created = 0;
  let skipped = 0;

  for (const issue of issues) {
    const labelSet = new Set((issue.labels ?? []).map((l) => l.toLowerCase()));
    const isFrontend = labelSet.has('frontend');
    const isBackend  = labelSet.has('backend');

    if (!isFrontend && !isBackend) {
      console.warn(`[WARN]    No routing label (frontend/backend) — skipping: "${issue.title}"`);
      skipped++;
      continue;
    }

    const targets: Array<[RepoTarget, Set<string>]> = [];
    if (isFrontend) targets.push([frontend, frontendTitles]);
    if (isBackend)  targets.push([backend, backendTitles]);

    for (const [target, existingTitles] of targets) {
      const result = await createIssueInRepo(target, issue, existingTitles);
      if (result === 'created') {
        existingTitles.add(issue.title.toLowerCase());
        created++;
      } else {
        skipped++;
      }
    }
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
  console.log(`Frontend repo: ${GITHUB_OWNER}/${GITHUB_FRONTEND_REPO}`);
  console.log(`Backend repo:  ${GITHUB_OWNER}/${GITHUB_BACKEND_REPO}\n`);

  console.log('--- Labels ---');
  await Promise.all([
    ensureLabels(FRONTEND_BASE, GITHUB_FRONTEND_REPO, backlog.labels ?? []),
    ensureLabels(BACKEND_BASE,  GITHUB_BACKEND_REPO,  backlog.labels ?? []),
  ]);

  console.log('\n--- Milestones ---');
  const [frontendMilestoneMap, backendMilestoneMap] = await Promise.all([
    ensureMilestones(FRONTEND_BASE, GITHUB_FRONTEND_REPO, backlog.milestones ?? []),
    ensureMilestones(BACKEND_BASE,  GITHUB_BACKEND_REPO,  backlog.milestones ?? []),
  ]);

  console.log('\n--- Issues ---');
  await ensureIssues(
    backlog.issues,
    { baseUrl: FRONTEND_BASE, name: GITHUB_FRONTEND_REPO, milestoneMap: frontendMilestoneMap },
    { baseUrl: BACKEND_BASE,  name: GITHUB_BACKEND_REPO,  milestoneMap: backendMilestoneMap }
  );
}

main().catch((err: unknown) => {
  console.error('[ERROR]', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
