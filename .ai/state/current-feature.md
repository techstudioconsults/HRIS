# Current Feature Context

**Feature Name**: HR Employee Bulk Import
**Status**: 🚧 In Progress
**Started**: 2026-05-02
**Phase**: Implementation

---

## Feature Goal

Implement a frontend-driven, multi-step bulk employee import workflow that:

1. Accepts `.xlsx` / `.xls` file uploads
2. Parses employee rows in-browser via SheetJS
3. Maps Excel columns → API payload fields
4. Validates every row before submission
5. Previews valid/invalid rows in a table
6. Executes import via the existing `POST /employees` multipart endpoint using controlled concurrency
7. Tracks per-row progress live via `BatchProgress`
8. Handles partial failures gracefully
9. Allows retrying failed rows only
10. Exports a CSV failure report

---

## Route

- **Page**: `/admin/employees/bulk-import`
- **Module path**: `src/modules/@org/admin/employee/_views/bulk-import/`
- **Page file**: `src/app/(private)/(org)/admin/employees/bulk-import/page.tsx`

---

## Backend Contract

Existing endpoint (no changes needed):

```http
POST /employees
Content-Type: multipart/form-data

FormData fields:
  firstName, lastName, email, phoneNumber, password
  teamId, roleId
  dateOfBirth (ISO), gender, startDate (ISO)
  employmentType, workMode
  baseSalary, bankName, accountName, accountNumber, bankCode
  permissions[] (optional)
```

Response: `{ status: "success", data: Employee }` on 201.

---

## Excel Column Schema (Required Headers)

| Excel Header    | API Field      | Validation                                   |
| --------------- | -------------- | -------------------------------------------- |
| First Name      | firstName      | required, min 1 char                         |
| Last Name       | lastName       | required, min 1 char                         |
| Email           | email          | required, valid email, unique in sheet       |
| Phone Number    | phoneNumber    | required, E.164 or 10+ digits                |
| Department      | teamId         | required, must match a loaded team name      |
| Role            | roleId         | required, must match role in team            |
| Date of Birth   | dateOfBirth    | required, YYYY-MM-DD                         |
| Gender          | gender         | required, 'male' or 'female'                 |
| Start Date      | startDate      | required, YYYY-MM-DD                         |
| Employment Type | employmentType | required, 'full time'/'part time'/'contract' |
| Work Mode       | workMode       | required, 'remote'/'onsite'/'hybrid'         |
| Base Salary     | baseSalary     | required, number > 0                         |
| Bank Name       | bankName       | required                                     |
| Account Name    | accountName    | required                                     |
| Account Number  | accountNumber  | required                                     |
| Bank Code       | bankCode       | required                                     |

---

## New Dependency

- **SheetJS (`xlsx`)** — for in-browser Excel parsing (to be added to `apps/user-dashboard/package.json`)
- No `p-limit` — a custom `runConcurrently` utility will be implemented inline

Decision logged in `.ai/memory/decisions.md`.

---

## Architecture — Module File Tree

```
src/modules/@org/admin/employee/_views/bulk-import/
  index.tsx                       # Wizard orchestrator (import steps, state machine)
  components/
    import-stepper.tsx            # Visual step indicator (Upload → Preview → Import → Summary)
    step-upload.tsx               # Step 1: file drag-drop UI
    step-preview.tsx              # Step 2: preview table with valid/invalid rows
    step-progress.tsx             # Step 3: live import progress
    step-summary.tsx              # Step 4: results summary, retry, download report
  hooks/
    use-bulk-import.ts            # Central state machine hook (Zustand + local state)
  services/
    excel-parser.ts               # SheetJS parse → RawImportRow[]
    field-mapper.ts               # RawImportRow → MappedImportRow (column mapping + team/role resolution)
    validator.ts                  # MappedImportRow → ValidatedImportRow (Zod-based row validation)
    import-orchestrator.ts        # Concurrent FormData submission engine
    report-generator.ts           # CSV export for failed rows
  types/
    index.ts                      # All types for bulk import domain
```

---

## Acceptance Criteria

- [ ] **AC-001** — HR can upload `.xlsx` or `.xls` files via drag-and-drop or browse; unsupported formats are rejected with a clear error.
- [ ] **AC-002** — Empty spreadsheets show a clear error state without crashing.
- [ ] **AC-003** — Missing required headers shows a descriptive error before reaching the preview step.
- [ ] **AC-004** — Each spreadsheet row is validated; errors are shown per-row in the preview table.
- [ ] **AC-005** — The preview table shows: Row #, Name, Email, Department, Role, Status (Valid/Invalid), Errors.
- [ ] **AC-006** — Only valid rows are submitted; invalid rows are skipped unless the user retries with corrected data.
- [ ] **AC-007** — Import uses controlled concurrency (≤5 parallel requests); never fires all requests simultaneously.
- [ ] **AC-008** — Live progress indicator shows total/completed/succeeded/failed counts and percentage.
- [ ] **AC-009** — Partial failures do not abort the entire import; successful rows complete normally.
- [ ] **AC-010** — Import summary shows total/succeeded/failed with per-row results.
- [ ] **AC-011** — "Retry Failed" button re-runs only the failed rows without re-uploading.
- [ ] **AC-012** — "Download Failure Report" exports a CSV with original row data + failure reason.
- [ ] **AC-013** — After successful import, the employee list query is invalidated.
- [ ] **AC-014** — The wizard step state is UI-only (not URL-persisted); page refresh returns to step 1 (by design — import is a destructive multi-step flow).
- [ ] **AC-015** — No TypeScript errors; strict mode passes.
- [ ] **AC-016** — Accessible: ARIA roles on stepper, live region on progress, keyboard navigation.

---

## Files to Create

- `_views/bulk-import/types/index.ts`
- `_views/bulk-import/services/excel-parser.ts`
- `_views/bulk-import/services/field-mapper.ts`
- `_views/bulk-import/services/validator.ts`
- `_views/bulk-import/services/import-orchestrator.ts`
- `_views/bulk-import/services/report-generator.ts`
- `_views/bulk-import/hooks/use-bulk-import.ts`
- `_views/bulk-import/components/import-stepper.tsx`
- `_views/bulk-import/components/step-upload.tsx`
- `_views/bulk-import/components/step-preview.tsx`
- `_views/bulk-import/components/step-progress.tsx`
- `_views/bulk-import/components/step-summary.tsx`
- `_views/bulk-import/index.tsx`
- `app/(private)/(org)/admin/employees/bulk-import/page.tsx`

## Files to Modify

- `modules/@org/admin/employee/index.ts` — add `BulkImportEmployee` export
- `modules/@org/admin/employee/_views/employee/components/employee-header-section.tsx` — add "Bulk Import" button
- `apps/user-dashboard/package.json` — add `xlsx`
- `.ai/memory/decisions.md` — log xlsx dependency decision
