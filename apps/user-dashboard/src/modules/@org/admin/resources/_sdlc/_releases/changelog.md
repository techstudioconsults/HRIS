# Resources Module — Changelog

_All notable changes to the Resources module are documented here._

Format: [Conventional Commits](https://www.conventionalcommits.org/)

---

## [Unreleased]

### Added

- `_sdlc/` documentation structure scaffolded (all phases: overview, product, architecture, domain, API, security, design, testing, docs, releases).

---

## [0.1.0] — TBD

### Added

- Initial module scaffold: `_views/`, `_components/`, `services/`, `types/`, `utils/`.
- `ResourcesView` with Folders and Files tab layout.
- `FolderCard` component with rename and delete action menu.
- `FileCard` component with download and delete action menu.
- `useFolders` and `useFiles` TanStack Query hooks.
- `useCreateFolder` mutation hook with optimistic update.
- `useUpload` mutation hook with per-file progress tracking.
- `CreateFolderModal` with React Hook Form + Zod validation.
- `UploadFileDropzone` with drag-and-drop support.
- `BreadcrumbNav` with URL-param-based folder path tracking.

---

_Previous module history: see the root `CHANGELOG.md` for repository-level changes._
