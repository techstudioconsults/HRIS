# Current Feature Context

**Feature Name**: Admin Dashboard — ActiveUser Component (Live Data Wiring)
**Status**: Done
**Phase**: Complete
**Started**: 2026-05-04
**Completed**: 2026-05-04

## Summary

Wired the admin dashboard `ActiveUser` view with real API data across five widgets.

## Files Created

| File                                                             | Purpose                                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `modules/@org/admin/dashboard/types/dashboard-api.ts`            | Types: PayrollMonthSummary, AttendanceMonthRecord, LeaveDistributionEntry      |
| `modules/@org/admin/dashboard/services/dashboard.service.ts`     | DashboardService: payroll summary, attendance overview, leave distribution     |
| `modules/@org/admin/dashboard/services/use-dashboard-service.ts` | Hooks: useGetPayrollSummary, useGetAttendanceOverview, useGetLeaveDistribution |

## Files Modified

| File                                                | Change                                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `lib/react-query/query-keys.ts`                     | Added `dashboard.*` query keys                                                             |
| `lib/tools/dependencies.ts`                         | Registered DASHBOARD_SERVICE + added missing container.add()                               |
| `_components/leave-piechart.tsx`                    | Self-fetches leave distribution; skeleton loading; fallback to static                      |
| `_components/payrool-linechart.tsx`                 | Self-fetches payroll summary; skeleton loading; fallback to static                         |
| `_components/attendance-barchart.tsx`               | Self-fetches attendance overview; skeleton loading; fallback to static                     |
| `admin/dashboard/_components/card-section.tsx`      | Live: new joiners (30d employee filter), pending leaves count, total net pay, attendance % |
| `admin/dashboard/_components/recent-activities.tsx` | Live: notifications API via useAppService + useSession                                     |

## Key Decisions

- Payroll summary response nesting: `response.data.data.data` (extra `data` key in envelope)
- Attendance overview response: `response.data.data` (direct array under `data`)
- New joiners: `GET /employees?limit=1000` + client-side filter by createdAt within 30 days
- Chart components self-fetch — no prop drilling through LeaveAndPayroll / AttendanceAndRecentActivities wrappers
- Skeleton shown inline inside DashboardCard `value` prop (accepts ReactNode)
- Zero new TypeScript errors introduced
