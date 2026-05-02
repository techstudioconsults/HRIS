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
