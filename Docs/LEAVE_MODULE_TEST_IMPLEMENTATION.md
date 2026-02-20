# Leave Module - Test Implementation Guide

Complete test implementation for the HRIS leave management module covering unit tests, component tests, and end-to-end tests.

## Overview

This document provides a complete guide to the test suite for the leave module, including:

- Unit tests for services, stores, and validation
- Component tests for UI components
- End-to-end tests for complete user workflows
- Running and debugging tests

## Test Files Created

### Unit Tests

```
apps/user-dashboard/__tests__/unit/leave/
├── leave-service.test.ts           ✅ Service layer CRUD operations
├── leave-store.test.ts             ✅ Zustand state management
└── leave-form-schema.test.ts       ✅ Zod form validation schema
```

### Component Tests

```
apps/user-dashboard/__tests__/components/leave/
├── LeaveHeader.test.tsx            ✅ Header with search & navigation
├── LeaveBody.test.tsx              ✅ Data table with filtering
├── LeaveSetupModal.test.tsx        ✅ Setup wizard modal
└── CreateLeaveTypeForm.test.tsx    ✅ Form with validation & submission
```

### E2E Tests

```
apps/user-dashboard/e2e/
└── leave.e2e.spec.ts               ✅ Complete user workflows
```

---

## Unit Test Details

### leave-service.test.ts

Tests for the `LeaveService` class that handles all API interactions.

**Coverage:**

- ✅ `createLeaveType()` - POST `/leaves`, returns LeaveType on 201, handles errors
- ✅ `getLeaveTypes()` - GET `/leaves`, handles paginated & legacy response formats
- ✅ `getLeaveTypeById()` - GET `/leaves/{id}`, extracts nested data
- ✅ `updateLeaveType()` - PUT `/leaves/{id}`, accepts partial payload
- ✅ `deleteLeaveType()` - DELETE `/leaves/{id}`, returns success message
- ✅ `getLeaveRequests()` - GET `/leave-requests`, handles filters

**Key Test Cases:**

```typescript
// Create success
POST /leaves → 201 → Returns LeaveType { id, name, days, ... }

// Create failure
POST /leaves → 400 → Returns undefined

// Get with pagination
GET /leaves → 200 → Returns { items: [], metadata: { total, page, ... } }

// Get with legacy format
GET /leaves → 200 → Returns { data: LeaveType[] }

// Update partial
PUT /leaves/{id} → 200 → Only sends changed fields

// Delete
DELETE /leaves/{id} → 200 → Returns { message: "..." }
```

**Run:**

```bash
pnpm test -- leave-service.test.ts
```

---

### leave-store.test.ts

Tests for the Zustand store managing leave module UI state.

**Coverage:**

- ✅ Initial state verification (all false/null)
- ✅ `setShowLeaveSetupModal()` - Open/close setup modal
- ✅ `setHasCompletedLeaveSetup()` - Track setup completion
- ✅ `setShowLeaveDetailsDrawer()` - Open/close details drawer
- ✅ `setSelectedLeaveRequestId()` - Select request for viewing
- ✅ `resetUI()` - Reset all state to initial values
- ✅ Multiple state changes & independence

**Key Test Cases:**

```typescript
// Initial state
{ showLeaveSetupModal: false, hasCompletedLeaveSetup: false, ... }

// State updates
setShowLeaveSetupModal(true) → { showLeaveSetupModal: true, ... }

// Reset to initial
resetUI() → All state reset to defaults

// Independent mutations
Each state change only affects that specific state
```

**Run:**

```bash
pnpm test -- leave-store.test.ts
```

---

### leave-form-schema.test.ts

Tests for Zod schema validation for create leave type form.

**Field Validation:**

| Field                    | Rules                         | Valid          | Invalid        |
| ------------------------ | ----------------------------- | -------------- | -------------- |
| `name`                   | Required, min 1 char          | "Annual Leave" | "", null       |
| `days`                   | Required, number, >0          | 20             | "20", -1, 0    |
| `cycle`                  | Required, string              | "yearly"       | "", null       |
| `maxLeaveDaysPerRequest` | Required, number, >0          | 5              | "5", 0         |
| `eligibility`            | ["3","6","12","24","36","48"] | "12"           | "9", "100"     |
| `enableRollover`         | Boolean                       | true, false    | "true"         |
| `maxNumberOfRollOver`    | If enabled: required, >0      | 5              | 0 (if enabled) |

**Key Test Cases:**

```typescript
// Valid complete form
{ name: "Annual Leave", days: 20, cycle: "yearly", ... }
→ success: true

// Invalid days
{ days: "20" } → error "Days must be a number"
{ days: 0 } → error "Days must be greater than 0"
{ days: -5 } → error "Days must be greater than 0"

// Rollover conditional
enableRollover: false, maxNumberOfRollOver: undefined → Valid
enableRollover: true, maxNumberOfRollOver: undefined → Invalid
enableRollover: true, maxNumberOfRollOver: 5 → Valid
enableRollover: true, maxNumberOfRollOver: 0 → Invalid

// Invalid eligibility
"9", "100", "unknown" → error "eligibility must be one of [3, 6, 12, 24, 36, 48]"
```

**Run:**

```bash
pnpm test -- leave-form-schema.test.ts
```

---

## Component Test Details

### LeaveHeader.test.tsx

Tests for header component with search, filter, and navigation.

**Features Tested:**

- ✅ Renders title "Leave Hub" and subtitle
- ✅ SearchInput displays with correct placeholder
- ✅ `onSearch()` callback fired on user input
- ✅ Filter button opens dropdown
- ✅ Dropdown shows "Basic filtering coming soon" message
- ✅ "Manage Leave Types" button navigates to `/admin/leave/type`

**Key Test Scenarios:**

```typescript
// Search
User types "Jane" → onSearch("Jane") called
User types "John" → onSearch("John") called

// Navigation
Click "Manage Leave Types" → router.push("/admin/leave/type")

// Filter
Click Filter → Dropdown opens with message
```

**Run:**

```bash
pnpm test -- LeaveHeader.test.tsx
```

---

### LeaveBody.test.tsx

Tests for data table component with search filtering.

**Features Tested:**

- ✅ Renders AdvancedDataTable with dummy requests
- ✅ Displays employee name, leave type, status, dates
- ✅ Search filters by employee name (case-insensitive)
- ✅ Search filters by leave type name
- ✅ Search filters by status
- ✅ Shows empty state for no matches
- ✅ Different messages: "No matching" vs "No requests yet"
- ✅ Calls `getRowActions()` for each request

**Test Scenarios:**

```typescript
// Rendering
Table shows:
- Jane Doe | Annual Leave | Pending
- John Smith | Sick Leave | Approved
- Amina Yusuf | Casual Leave | Declined

// Search filtering
searchQuery="jane" → Only Jane Doe visible
searchQuery="John" → Only John Smith visible
searchQuery="approved" → Only John Smith visible

// Empty state
searchQuery="NonExistent" → Shows "No matching leave requests"
searchQuery="" with no data → Shows "No leave requests yet"

// Row actions
Each row calls getRowActions(request) with correct LeaveRequest object
```

**Run:**

```bash
pnpm test -- LeaveBody.test.tsx
```

---

### LeaveSetupModal.test.tsx

Tests for setup wizard modal.

**Features Tested:**

- ✅ Auto-opens on component mount
- ✅ Displays title "Set up Leave Types"
- ✅ Shows instructions list
- ✅ "Manage Leave Types" → navigates & closes
- ✅ "Remind me later" → just closes
- ✅ Uses `router.push()` for navigation

**Test Scenarios:**

```typescript
// Mount behavior
Component mounts → Dialog automatically opens

// Navigation
Click "Manage Leave Types"
  → router.push("/admin/leave/type")
  → Modal closes

Click "Remind me later"
  → Modal closes
  → No navigation
```

**Run:**

```bash
pnpm test -- LeaveSetupModal.test.tsx
```

---

### CreateLeaveTypeForm.test.tsx

Tests for leave type creation form.

**Features Tested:**

- ✅ Renders 8 form fields with required indicators
- ✅ Shows `maxNumberOfRollOver` field only when rollover enabled
- ✅ Form submission calls mutation with correct payload
- ✅ Success: shows toast, closes form, resets fields
- ✅ Error: shows error toast, keeps form open
- ✅ Cancel: resets form, calls `onClose()`
- ✅ Correct dropdown options for cycle & eligibility

**Form Fields:**

- `name` - Text input (required)
- `days` - Number input (required)
- `cycle` - Select dropdown (required) - [Yearly, Monthly, Weekly, Daily]
- `maxLeaveDaysPerRequest` - Number input (required)
- `eligibility` - Select dropdown (required) - [3,6,12,24,36,48 months]
- `enableRollover` - Switch toggle
- `maxNumberOfRollOver` - Number input (required if rollover enabled)
- `description` - Text input (optional)

**Test Scenarios:**

```typescript
// Form fill & submit
Fill fields → Click Submit
→ mutation.mutateAsync() called with:
  { name: "...", days: 20, cycle: "yearly",
    maxLeaveDaysPerRequest: 5, eligibility: "12",
    maxNumberOfRollOver: undefined (if rollover disabled) }

// Success
mutation succeeds
→ toast.success("Leave type 'Name' created")
→ Form closes
→ onClose() called

// Error
mutation fails
→ toast.error("Failed to create leave type")
→ Form stays open (can retry)

// Rollover conditional
enableRollover: false → maxNumberOfRollOver hidden
enableRollover: true → maxNumberOfRollOver shown
```

**Run:**

```bash
pnpm test -- CreateLeaveTypeForm.test.tsx
```

---

## E2E Test Details

### leave.e2e.spec.ts

Complete end-to-end workflows using Playwright.

**Test Suites:**

#### 1. Leave Setup Modal

```typescript
✅ Show setup modal on first visit to /admin/leave
✅ Navigate to leave types on "Manage Leave Types" click
✅ Close modal on "Remind me later" click
```

#### 2. Search Leave Requests

```typescript
✅ Display multiple leave requests (Jane, John, Amina)
✅ Filter by employee name ("Jane" → only Jane visible)
✅ Filter by leave type ("Sick Leave")
✅ Filter by status ("approved")
✅ Show all requests when search cleared
✅ Show empty state when no matches
```

#### 3. Filter Button

```typescript
✅ Show Filter button
✅ Open dropdown on click
✅ Show "Basic filtering coming soon" message
```

#### 4. Leave Header Navigation

```typescript
✅ Show "Leave Hub" title and subtitle
✅ Navigate to /admin/leave/type on button click
```

#### 5. Create Leave Type

```typescript
✅ Navigate to /admin/leave/type page
✅ Open create form modal
✅ Fill form with:
   - Name: "Bereavement Leave"
   - Days: 3
   - Cycle: "Yearly"
   - Max Days: 3
   - Eligibility: "12 Months+"
   - Rollover: Disabled
✅ Submit and see success toast
✅ Show validation errors for empty form
```

#### 6. Error Scenarios

```typescript
✅ Handle network errors gracefully
✅ Show empty state for new organization
```

#### 7. Accessibility

```typescript
✅ Proper heading hierarchy (H1 present)
✅ Accessible form labels
✅ Proper button labels
```

#### 8. Responsive Design

```typescript
✅ Desktop viewport (1920x1080)
✅ Tablet viewport (768x1024)
✅ Mobile viewport (375x667)
```

**Run E2E Tests:**

```bash
# Headless mode
pnpm test:e2e

# Interactive UI (helpful for debugging)
pnpm test:e2e:ui

# Specific test file
pnpm test:e2e -- leave.e2e.spec.ts

# Debug mode (opens inspector)
pnpm test:e2e -- --debug
```

---

## Running Tests

### Quick Start

```bash
# Run all tests once
pnpm test

# Run with watch mode (auto-rerun on changes)
pnpm test:watch

# Interactive test UI dashboard
pnpm test:ui
```

### Run Specific Tests

```bash
# Run only leave module unit tests
pnpm test -- __tests__/unit/leave/

# Run only component tests
pnpm test -- __tests__/components/leave/

# Run specific test file
pnpm test -- leave-service.test.ts

# Run tests matching pattern
pnpm test -- --grep "form validation"
```

### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run specific E2E file
pnpm test:e2e -- leave.e2e.spec.ts

# Run with UI mode (interactive browser)
pnpm test:e2e:ui

# Debug mode
pnpm test:e2e -- --debug

# Run in specific browser
pnpm test:e2e -- --project=chromium
pnpm test:e2e -- --project=firefox
pnpm test:e2e -- --project=webkit
```

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# Coverage report will be in:
# - coverage/index.html (browser)
# - coverage/coverage-final.json (raw data)
```

### Run for CI/CD

```bash
# Full test suite (used in CI)
pnpm test
pnpm test:e2e

# With coverage
pnpm test:coverage
```

---

## Test Data & Fixtures

### Mock Leave Types

```typescript
const mockLeaveTypes = [
  {
    id: 'lt_001',
    name: 'Annual Leave',
    days: 20,
    cycle: 'Yearly',
    carryOver: true,
    maxNumberOfRollOver: 5,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'lt_002',
    name: 'Sick Leave',
    days: 10,
    cycle: 'Yearly',
    carryOver: false,
  },
  {
    id: 'lt_003',
    name: 'Casual Leave',
    days: 5,
    cycle: 'Monthly',
    carryOver: false,
  },
];
```

### Mock Leave Requests

```typescript
const mockLeaveRequests = [
  {
    id: 'lr_001',
    employeeId: 'emp_001',
    employeeName: 'Jane Doe',
    leaveTypeId: 'lt_annual',
    leaveTypeName: 'Annual Leave',
    startDate: '2026-01-10',
    endDate: '2026-01-12',
    days: 3,
    reason: 'Family event',
    status: 'pending',
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'lr_002',
    employeeId: 'emp_002',
    employeeName: 'John Smith',
    leaveTypeId: 'lt_sick',
    leaveTypeName: 'Sick Leave',
    startDate: '2026-01-02',
    endDate: '2026-01-03',
    days: 2,
    reason: 'Medical appointment',
    status: 'approved',
    approvedBy: 'HR Admin',
    approvedAt: '2026-01-02',
    createdAt: '2026-01-01T00:00:00Z',
  },
];
```

---

## Debugging Tests

### Debug Unit/Component Tests

```bash
# Run in watch mode with debugging
pnpm test:watch

# Run specific test with detailed output
pnpm test -- leave-service.test.ts --reporter=verbose
```

### Debug E2E Tests

```bash
# Interactive browser with Playwright Inspector
pnpm test:e2e -- --debug

# View test results
pnpm test:e2e -- --reporter=html

# Generate videos/screenshots on failure (already configured)
# Check: playwright-report/ or test-results/
```

### Common Issues & Solutions

**Test timeouts:**

```bash
# Increase timeout
pnpm test -- --timeout=10000
```

**Mock not working:**

- Verify mock path matches import
- Mock should be defined before component import
- Use `vi.mock()` at top of test file

**E2E navigation fails:**

- Check BASE_URL environment variable
- Ensure app is running on correct port
- Use `page.waitForURL()` for navigation waits

---

## Test Coverage Targets

**Current coverage:**

- Unit tests: 8 files (services, stores, validation)
- Component tests: 4 files (UI components)
- E2E tests: 1 file (complete workflows)

**Target coverage:**

- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

**View coverage:**

```bash
pnpm test:coverage
# Open: coverage/index.html
```

---

## Continuous Integration

Tests are configured to run automatically on:

- Pull requests
- Commits to main/develop branches
- Pre-commit hooks (via Husky)

**CI Configuration:**

- See: `.github/workflows/` or `turbo.json`
- Tests run in parallel on CI
- E2E tests run after unit tests
- Coverage reports generated automatically

---

## Next Steps

1. **Run tests locally:**

   ```bash
   pnpm test:watch
   ```

2. **View test UI:**

   ```bash
   pnpm test:ui
   ```

3. **Run E2E tests:**

   ```bash
   pnpm test:e2e:ui
   ```

4. **Add more tests** for:
   - Edit leave type workflow
   - Delete leave type with confirmation
   - Approve/reject leave requests
   - Leave balance calculations
   - Permission-based access (LEAVE_READ, LEAVE_MANAGE)

---

## References

- **Vitest Documentation:** https://vitest.dev
- **React Testing Library:** https://testing-library.com/react
- **Playwright Documentation:** https://playwright.dev
- **Project Testing Guide:** `Docs/TESTING.md`
