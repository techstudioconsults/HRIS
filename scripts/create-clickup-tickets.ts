#!/usr/bin/env node
/**
 * Reads backlog.json and creates ClickUp tasks.
 *
 * Required env vars:
 *   CLICKUP_API_TOKEN         – Personal API token (pk_...)
 *   CLICKUP_SPACE_ID          – Space ID (for tag management)
 *   CLICKUP_FRONTEND_LIST_ID  – List ID for frontend-labelled issues
 *   CLICKUP_BACKEND_LIST_ID   – List ID for backend-labelled issues
 *
 * Optional:
 *   --dry-run   Print actions without making API calls
 *
 * Issues with both frontend + backend labels are created in both lists.
 * Issues with neither label are skipped with a warning.
 */

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

interface ClickUpTag {
  readonly name: string;
}

interface ClickUpTask {
  readonly id: string;
  readonly name: string;
}

interface ClickUpTaskPage {
  readonly tasks: ClickUpTask[];
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

const API_TOKEN = requireEnv('CLICKUP_API_TOKEN');
const SPACE_ID = requireEnv('CLICKUP_SPACE_ID');
const FRONTEND_LIST_ID = requireEnv('CLICKUP_FRONTEND_LIST_ID');
const BACKEND_LIST_ID = requireEnv('CLICKUP_BACKEND_LIST_ID');
const DRY_RUN = process.argv.includes('--dry-run');

const BASE_URL = 'https://api.clickup.com/api/v2';

// ---------------------------------------------------------------------------
// Priority mapping — derived from issue labels
// ---------------------------------------------------------------------------

function resolvePriority(labels: readonly string[]): number {
  const set = new Set(labels.map((l) => l.toLowerCase()));
  if (set.has('security')) return 1; // urgent
  if (set.has('bug')) return 2;      // high
  if (set.has('perf')) return 2;     // high
  return 3;                          // normal
}

// ---------------------------------------------------------------------------
// ClickUp REST client
// ---------------------------------------------------------------------------

async function cuFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: API_TOKEN,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `ClickUp API ${response.status} ${response.statusText} [${path}]: ${body}`
    );
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Tags — ensure all label names exist as space-level tags
// ---------------------------------------------------------------------------

async function ensureTags(labelNames: readonly string[]): Promise<void> {
  if (labelNames.length === 0) return;

  const { tags: existing } = await cuFetch<{ tags: ClickUpTag[] }>(
    `/space/${SPACE_ID}/tag`
  );
  const existingNames = new Set(existing.map((t) => t.name.toLowerCase()));

  for (const name of labelNames) {
    if (existingNames.has(name.toLowerCase())) {
      console.log(`[SKIP]    Tag already exists: ${name}`);
      continue;
    }
    if (DRY_RUN) {
      console.log(`[DRY-RUN] Would create tag: ${name}`);
      continue;
    }
    await cuFetch(`/space/${SPACE_ID}/tag`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    console.log(`[CREATE]  Tag created: ${name}`);
  }
}

// ---------------------------------------------------------------------------
// Tasks — fetch all existing tasks in a list (all pages)
// ---------------------------------------------------------------------------

async function fetchExistingTasks(listId: string): Promise<Set<string>> {
  const titles = new Set<string>();
  let page = 0;

  while (true) {
    const { tasks } = await cuFetch<ClickUpTaskPage>(
      `/list/${listId}/task?archived=false&page=${page}&subtasks=false&include_closed=true`
    );
    for (const t of tasks) titles.add(t.name.toLowerCase());
    if (tasks.length < 100) break;
    page++;
  }

  return titles;
}

// ---------------------------------------------------------------------------
// Task creation
// ---------------------------------------------------------------------------

interface TaskTarget {
  listId: string;
  label: string; // "frontend" | "backend"
  existingTitles: Set<string>;
}

async function createTask(
  target: TaskTarget,
  issue: IssueDef,
  milestones: readonly MilestoneDef[]
): Promise<'created' | 'skipped'> {
  if (target.existingTitles.has(issue.title.toLowerCase())) {
    console.log(
      `[SKIP]    [${target.label}] Task already exists: "${issue.title}"`
    );
    return 'skipped';
  }

  const tags = [...(issue.labels ?? [])];
  if (issue.milestone) tags.push(issue.milestone);

  // Resolve due_date from milestone
  let dueDate: number | undefined;
  if (issue.milestone) {
    const ms = milestones.find((m) => m.title === issue.milestone);
    if (ms?.due_on) dueDate = new Date(ms.due_on).getTime();
  }

  const milestoneNote = issue.milestone
    ? `\n\n---\n**Sprint / Milestone:** ${issue.milestone}`
    : '';

  const payload: Record<string, unknown> = {
    name: issue.title,
    markdown_description: (issue.body ?? '') + milestoneNote,
    tags,
    priority: resolvePriority(issue.labels ?? []),
    ...(dueDate !== undefined ? { due_date: dueDate, due_date_time: true } : {}),
    notify_all: false,
  };

  if (DRY_RUN) {
    console.log(
      `[DRY-RUN] [${target.label}] Would create task: "${issue.title}" | tags: [${tags.join(', ')}]`
    );
    return 'skipped';
  }

  const task = await cuFetch<ClickUpTask>(`/list/${target.listId}/task`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  console.log(
    `[CREATE]  [${target.label}] Task ${task.id} created: "${issue.title}"`
  );
  return 'created';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const backlogPath = resolve(__dirname, 'backlog.json');
  const backlog = JSON.parse(readFileSync(backlogPath, 'utf8')) as Backlog;

  if (DRY_RUN) console.log('[DRY-RUN] No changes will be made.\n');
  console.log(`Frontend list: ${FRONTEND_LIST_ID}`);
  console.log(`Backend list:  ${BACKEND_LIST_ID}`);
  console.log(`Space:         ${SPACE_ID}\n`);

  // 1. Ensure all label names exist as ClickUp space tags
  const allLabelNames = (backlog.labels ?? []).map((l) => l.name);
  const allMilestoneTitles = (backlog.milestones ?? []).map((m) => m.title);
  console.log('--- Tags ---');
  await ensureTags([...allLabelNames, ...allMilestoneTitles]);

  // 2. Pre-fetch existing tasks for deduplication
  console.log('\n--- Fetching existing tasks ---');
  const [frontendExisting, backendExisting] = await Promise.all([
    fetchExistingTasks(FRONTEND_LIST_ID),
    fetchExistingTasks(BACKEND_LIST_ID),
  ]);
  console.log(
    `Found ${frontendExisting.size} frontend tasks, ${backendExisting.size} backend tasks.`
  );

  const frontendTarget: TaskTarget = {
    listId: FRONTEND_LIST_ID,
    label: 'frontend',
    existingTitles: frontendExisting,
  };
  const backendTarget: TaskTarget = {
    listId: BACKEND_LIST_ID,
    label: 'backend',
    existingTitles: backendExisting,
  };

  // 3. Create tasks
  let created = 0;
  let skipped = 0;

  console.log('\n--- Tasks ---');
  for (const issue of backlog.issues) {
    const labelSet = new Set((issue.labels ?? []).map((l) => l.toLowerCase()));
    const isFrontend = labelSet.has('frontend');
    const isBackend = labelSet.has('backend');

    if (!isFrontend && !isBackend) {
      console.warn(
        `[WARN]    No routing label (frontend/backend) — skipping: "${issue.title}"`
      );
      skipped++;
      continue;
    }

    const targets: TaskTarget[] = [];
    if (isFrontend) targets.push(frontendTarget);
    if (isBackend) targets.push(backendTarget);

    for (const target of targets) {
      const result = await createTask(target, issue, backlog.milestones ?? []);
      if (result === 'created') {
        target.existingTitles.add(issue.title.toLowerCase());
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

main().catch((err: unknown) => {
  console.error('[ERROR]', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
