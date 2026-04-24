# ADR-001 — Resources Module Initial Design

- **Date**: 2026-04-23
- **Status**: Accepted
- **Deciders**: Architect, Frontend Implementer

## Context

The Resources module needed a frontend architecture that supports nested folder navigation, file uploads with progress tracking, and optimistic CRUD updates — all without introducing new global state management dependencies.

## Options Considered

1. **URL params for folder state + TanStack Query for server state** (chosen)
2. Zustand store holding `currentFolderId` and folder tree
3. Context API holding folder stack for breadcrumb

## Decision

Use URL query params (`?folderId=`, `?tab=`) for all navigation-relevant state so that the browser back button and shareable URLs work without custom history management. Use TanStack Query for all server state (folder lists, file lists). Use local `useState` only for ephemeral UI state (modal open, upload progress).

## Consequences

- Pro: Breadcrumb navigation is free — just read the URL path params.
- Pro: No new global state library needed; aligns with project-wide pattern.
- Pro: Deep links to a specific folder work out of the box.
- Con: URL params require SSR-safe reading via `useSearchParams` (client component wrapper needed).
- Con: Complex filter state (if added later) may make the URL verbose.

## Follow-up

If file search and filter complexity grows beyond 2-3 params, evaluate a `POST /search` endpoint and keep filter state in a local form rather than the URL.
