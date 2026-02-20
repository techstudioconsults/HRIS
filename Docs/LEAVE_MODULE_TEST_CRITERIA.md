# Leave Module - Unit & E2E Test Criteria

Real-world test scenarios for the leave management system covering leave types, requests, balances, and approvals.

## UNIT TESTS

### Service Layer (LeaveService)

#### Leave Type Operations

**Create Leave Type**

- ✅ Should POST to `/leaves` with valid payload
- ✅ Should return created LeaveType with ID
- ✅ Should handle optional fields (maxLeaveDaysPerRequest, eligibility, maxNumberOfRollOver)
- ❌ Should return null on non-201 status
- ❌ Should handle network errors gracefully

**Get Leave Types**

- ✅ Should GET from `/leaves` with optional filters
- ✅ Should parse paginated response { items, metadata }
- ✅ Should handle legacy response format { data: LeaveType[] }
- ❌ Should return null on non-200 status
- ✅ Should pass filters as query params

**Get Leave Type By ID**

- ✅ Should GET from `/leaves/{id}`
- ✅ Should extract nested data object
- ❌ Should return null on non-200 status
- ❌ Should handle 404 responses

**Update Leave Type**

- ✅ Should PUT to `/leaves/{id}` with partial payload
- ✅ Should allow updating: name, days, cycle, carryOver, description, maxLeaveDaysPerRequest, eligibility, maxNumberOfRollOver
- ❌ Should return null on non-200 status

**Delete Leave Type**

- ✅ Should DELETE `/leaves/{id}`
- ✅ Should return response with message
- ❌ Should return null on non-200 status

#### Leave Request Operations

**Get Leave Requests**

- ✅ Should GET from `/leave-requests` with optional filters
- ✅ Should handle pagination metadata
- ✅ Should parse both paginated and simple formats
- ❌ Should return null on non-200 status

### Custom Hooks (useLeaveService)

- ✅ useGetLeaveTypes: calls with filters, supports options, caches with queryKeys.leave.types()
- ✅ useCreateLeaveType: invalidates types() on success, supports onSuccess/onError
- ✅ useUpdateLeaveType: invalidates types() AND type(id) on success
- ✅ useDeleteLeaveType: invalidates types() on success
- ✅ useGetLeaveRequests: calls with filters and correct query key

### State Management (useLeaveStore - Zustand)

- ✅ Initial state: all false/null
- ✅ setShowLeaveSetupModal(boolean)
- ✅ setHasCompletedLeaveSetup(boolean)
- ✅ setShowLeaveDetailsDrawer(boolean)
- ✅ setSelectedLeaveRequestId(string | null)
- ✅ resetUI() → resets to initial state

### Form Validation (createLeaveTypeSchema - Zod)

**Field Rules:**

| Field                  | Rule                                    | Valid          | Invalid                   |
| ---------------------- | --------------------------------------- | -------------- | ------------------------- |
| name                   | required, min 1 char                    | "Annual Leave" | "", null                  |
| days                   | required, number, >0                    | 20             | "20", -1, 0               |
| cycle                  | required, string                        | "yearly"       | "", null                  |
| maxLeaveDaysPerRequest | required, number, >0                    | 5              | "5", 0                    |
| eligibility            | required, ["3","6","12","24","36","48"] | "12"           | "9", "100"                |
| enableRollover         | boolean                                 | true, false    | "true"                    |
| maxNumberOfRollOver    | required IF enableRollover=true, >0     | 5              | 0, undefined (if enabled) |

---

## COMPONENT TESTS

### LeaveHeader

- ✅ Renders title "Leave Hub" + subtitle
- ✅ SearchInput calls onSearch(query) callback
- ✅ Filter button opens dropdown with placeholder text
- ✅ "Manage Leave Types" button navigates to `/admin/leave/type`

### LeaveBody

- ✅ Renders AdvancedDataTable with dummy requests
- ✅ Search filters by: employeeName, leaveTypeName, status (case-insensitive)
- ✅ Shows empty state when no matches found
- ✅ Calls getRowActions(row) for each request row
- ✅ Different empty messages: "No leave requests yet" vs "No matching leave requests"

### LeaveSetupModal

- ✅ Auto-opens on mount
- ✅ Shows title + instruction list
- ✅ "Manage Leave Types" → navigates to `/admin/leave/type` + closes
- ✅ "Remind me later" → just closes modal

### CreateLeaveTypeForm

- ✅ Renders 8 fields in responsive grid: name, days, cycle, maxLeaveDaysPerRequest, eligibility, enableRollover, maxNumberOfRollOver, description
- ✅ Shows validation errors on invalid input
- ✅ maxNumberOfRollOver field only shows when enableRollover=true
- ✅ Submit: calls mutation with correct payload structure
- ✅ Success: shows toast "Leave type {name} created" + closes form
- ✅ Error: shows error toast with API message + form stays open
- ✅ Cancel: resets form + calls onClose
- ✅ Dropdown options match spec: Cycle=[Yearly, Monthly, Weekly, Daily], Eligibility=[3,6,12,24,36,48]

### LeaveDetailsDrawer

- ✅ Opens when selectedLeaveRequestId is set
- ✅ Displays: employee info, leave type, dates, reason, status
- ✅ Shows approver info if status="approved"
- ✅ Closes when setShowLeaveDetailsDrawer(false)

---

## E2E TESTS

### Scenario 1: Admin Creates Leave Type

```
✅ Admin navigates to /admin/leave/type
✅ Clicks "Create Leave Type" button
✅ Form opens with empty fields
✅ Fills: Name="Bereavement Leave", Days=3, Cycle="Yearly", MaxDays=3, Eligibility="12", Rollover=OFF
✅ Clicks Submit
✅ Toast shows success message
✅ Form closes
✅ New leave type appears in table
```

### Scenario 2: Admin Enables Rollover

```
✅ Creates leave type with Rollover=ON
✅ maxNumberOfRollOver field appears
✅ Fills maxNumberOfRollOver=5
✅ Submit succeeds
✅ Leave type saved with carryOver=true
```

### Scenario 3: Search Leave Requests

```
✅ Admin on /admin/leave page sees 3 requests
✅ Types "Jane" in search box
✅ Only Jane Doe's request visible
✅ Clears search
✅ All 3 requests reappear
```

### Scenario 4: View Leave Request Details

```
✅ Admin clicks on leave request row
✅ LeaveDetailsDrawer slides open
✅ Shows complete request information
✅ Closes drawer on click outside or close button
```

### Scenario 5: Filter Button (Current)

```
✅ Admin clicks Filter button
✅ Dropdown shows: "Basic filtering for leave requests will be available soon"
```

### Error Cases

| Case            | Trigger                 | Expected                                                               |
| --------------- | ----------------------- | ---------------------------------------------------------------------- |
| API 500         | Create leave type fails | Toast: "Failed to create leave type" + error message + form stays open |
| Validation      | Days = -5               | Error: "Days must be greater than 0" + submit disabled                 |
| Bad Eligibility | Select "99"             | Error: "eligibility must be one of [3, 6, 12, 24, 36, 48]"             |
| Network Error   | Connection lost         | Graceful error handling + retry option                                 |

---

## TEST DATA FIXTURES

### Sample Leave Types

```typescript
const mockLeaveTypes = [
  {
    id: 'lt_001',
    name: 'Annual Leave',
    days: 20,
    cycle: 'Yearly',
    carryOver: true,
    maxNumberOfRollOver: 5,
  },
  {
    id: 'lt_002',
    name: 'Sick Leave',
    days: 10,
    cycle: 'Yearly',
    carryOver: false,
  },
];
```

### Sample Leave Requests

```typescript
const mockLeaveRequests = [
  {
    id: 'lr_001',
    employeeId: 'emp_001',
    employeeName: 'Jane Doe',
    leaveTypeId: 'lt_001',
    leaveTypeName: 'Annual Leave',
    startDate: '2026-02-10',
    endDate: '2026-02-12',
    days: 3,
    reason: 'Family event',
    status: 'pending',
    createdAt: '2026-01-15T10:30:00Z',
  },
];
```

### API Response Formats

```typescript
// Paginated format
{
  items: LeaveType[],
  metadata: {
    total: 10,
    page: 1,
    totalPages: 2,
    hasNextPage: true
  }
}

// Legacy format
{
  data: LeaveType[]
}
```

---

## QUICK START: RUN TESTS

```bash
# Unit + component tests (Vitest)
pnpm test --filter=user-dashboard

# Watch mode
pnpm test:watch

# Interactive UI
pnpm test:ui

# E2E tests (Playwright)
pnpm test:e2e

# E2E with debugger
pnpm test:e2e:ui

# Coverage report
pnpm test:coverage
```

---

## TEST FILE STRUCTURE

```
apps/user-dashboard/__tests__/
├── unit/leave/
│   ├── leave-service.test.ts           (Service CRUD + API handling)
│   ├── use-leave-service.test.ts       (Query/mutation hooks)
│   ├── leave-store.test.ts             (Zustand state)
│   └── leave-form-schema.test.ts       (Zod validation)
├── components/leave/
│   ├── LeaveHeader.test.tsx
│   ├── LeaveBody.test.tsx
│   ├── LeaveSetupModal.test.tsx
│   ├── LeaveDetailsDrawer.test.tsx
│   └── CreateLeaveTypeForm.test.tsx
└── e2e/
    └── leave.e2e.spec.ts               (Full user workflows)
```

---

## NOTES

- Tests use Vitest for unit/component, Playwright for E2E
- Mock HTTP responses using HttpAdapter
- Use `@workspace/test-utils` for shared setup
- Focus on real-world scenarios, not implementation details
- Tests should be simple, readable, and maintainable
