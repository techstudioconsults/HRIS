# Architectural Decision Records (ADRs)

Format:

- **Title**: [ADR-XXX] Short descriptive title
- **Date**: YYYY-MM-DD
- **Status**: Proposed | Accepted | Deprecated | Superseded
- **Context**: Problem statement
- **Options Considered**:
- **Decision**: Chosen solution + justification
- **Consequences**: Pros, cons, risks

---

## [ADR-002] Bulk Import: SheetJS for Excel Parsing + Inline Concurrency Limiter

**Date**: 2026-05-02
**Status**: Accepted

**Context**: The bulk import feature needs in-browser Excel parsing and controlled concurrency
for the import execution engine.

**Options Considered**:

1. **SheetJS (`xlsx`)** — industry standard for browser Excel parsing; supports .xlsx / .xls natively
2. Native `FileReader` + CSV-only — would not support .xlsx binary format; not viable
3. **`p-limit`** — popular concurrency limiter, but adds a runtime dependency for a ~15-line utility
4. **Inline `runConcurrently` worker pool** — a simple "N workers each pulling from a shared queue"
   pattern implemented inline; zero extra dependency, equivalent semantics

**Decision**:

- Add `xlsx@^0.18.5` to `apps/user-dashboard/package.json` — no viable alternative for .xlsx parsing.
- Implement `runConcurrently` inline inside `import-orchestrator.ts` rather than pulling in `p-limit`.
  The implementation is ≤20 lines and is fully self-contained.
- Bulk import wizard step state uses `useReducer` (page-local) — not URL-persisted by design.
  Destroying state on refresh is intentional for a destructive multi-step flow.

**Consequences**:

- ✅ One new runtime dependency (`xlsx`) — minimal and purpose-specific
- ✅ No `p-limit` or other extra packages required
- ✅ Concurrency logic is readable, testable, and co-located with the orchestrator
- ⚠️ `xlsx` bundle size is ~600 kB (minified); acceptable for an admin-only route

---

## [ADR-001] Modal State Persistence via nuqs URL Parameters

**Date**: 2026-05-01
**Status**: Accepted

**Context**: All modal open/close state across the application uses local React `useState(false)`.
Refreshing the page always dismisses open modals, preventing deep-linking and hurting UX continuity.

**Options Considered**:

1. `sessionStorage` — survives refresh but not copy/paste URL sharing; still volatile
2. Zustand persisted store (`zustand/middleware/persist`) — survives refresh but not URL-shareable; adds LocalStorage dependency
3. **nuqs URL search parameters** — survives refresh, URL-shareable, integrates with existing `nuqs@2.4.3` already in the project, follows Next.js App Router conventions

**Decision**: Use `nuqs` URL state (`modal`, `modalId`, `modalMode`) as the single source of truth
for modal open/close. Zustand stores retain non-URL-serializable workflow state only
(selected entity objects, isSubmitting flags, multi-step flow booleans).

**URL param schema per page**:

- `modal` — string key identifying the open modal (e.g., `'team'`, `'role-editor'`)
- `modalId` — entity ID for edit/view modals
- `modalMode` — `'create' | 'edit'`; omit when not needed
- `teamId` — parent context param (teams page only, for role/employee dialogs)

**Consequences**:

- ✅ Modals survive refresh, are deep-linkable, and integrate cleanly with App Router
- ✅ Browser back-button closes modals (nuqs uses `router.push` by default)
- ✅ No new runtime dependency — nuqs is already installed
- ⚠️ Edit modals on cold refresh must handle missing TanStack Query cache gracefully (loading state required)
- ⚠️ Destructive confirm dialogs and success alerts explicitly excluded from URL persistence
