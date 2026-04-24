# Admin Payroll — Component Tree

```
PayrollView (_views/payroll.tsx)
├── [if !setupComplete] PayrollSetupWizard
│   ├── Step1: PayCycleForm (pay cycle selector, pay day input)
│   ├── Step2: BankDetailsForm (account name, number, bank)
│   └── Step3: ReviewAndConfirm
│
└── [if setupComplete]
    ├── PayrollHeader
    │   ├── "Run Payroll" button
    │   ├── "Schedule Run" button → PayrollScheduleDrawer
    │   └── WalletBalanceBadge (inline wallet balance)
    │
    ├── PayrollRunCard (active/latest run)
    │   ├── RunStatusBadge (draft | processing | completed | approved | paid)
    │   ├── RunProgressBar (SSE-driven — shows during processing)
    │   ├── RunSummary (total gross, deductions, net, employee count)
    │   └── ApproveRunButton (disabled unless status=completed)
    │       └── ApproveRunDialog (confirmation + wallet balance check)
    │
    ├── PayrollRosterTable (TanStack Table)
    │   ├── EmployeeRosterRow[] (name, gross, deductions, net, status)
    │   │   └── RowActionMenu
    │   │       ├── ViewPayslip → PayslipViewer (modal)
    │   │       └── AddAdjustment → BonusDeductionDrawer
    │   ├── RosterTableSkeleton (loading)
    │   └── RosterEmptyState
    │
    ├── WalletPanel
    │   ├── WalletBalanceCard (current balance)
    │   ├── FundWalletButton → FundWalletDrawer
    │   │   └── BankTransferInstructions
    │   └── WalletTransactionHistory (paginated)
    │
    └── PayrollScheduleDrawer [controlled]
        ├── ScheduleDatePicker
        └── ScheduleConfirmButton
```
