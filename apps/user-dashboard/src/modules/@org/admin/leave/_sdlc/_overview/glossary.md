# Leave Management — Glossary

_Ubiquitous language for the leave management bounded context — all team members and agents must use these terms consistently._

## Terms

| Term                   | Definition                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| **Leave Type**         | A named category of absence (e.g. Annual Leave, Sick Leave, Casual Leave, Bereavement Leave, Maternity Leave, Paternity Leave) with its own allowance and rules. |
| **Leave Allowance**    | The number of days an employee is entitled to for a given leave type within one accrual cycle.                                                                   |
| **Accrual Cycle**      | The period over which a leave allowance resets or accrues — typically Monthly, Quarterly, or Annually.                                                           |
| **Leave Request**      | A formal employee submission requesting absence for a specific date range under a chosen leave type.                                                             |
| **Leave Balance**      | The remaining days available to an employee for a specific leave type in the current cycle.                                                                      |
| **Carry-Over**         | The portion of unused annual leave allowance that rolls into the next cycle; subject to a configurable cap.                                                      |
| **Eligibility Period** | The minimum tenure (e.g. 3 months probation) before an employee may apply for a particular leave type.                                                           |
| **Approval Workflow**  | The sequence of states a leave request passes through: `draft → pending → approved                                                                               | declined | cancelled`. |
| **Leave Policy**       | Organisation-wide rules governing all leave types, such as maximum consecutive days and advance notice requirements.                                             |
| **Setup Wizard**       | A multi-step guided form shown to HR admins on first login to configure leave types and policies for a new organisation.                                         |
| **Carry-Over Cap**     | The maximum number of days that can be carried over from one accrual cycle to the next for a given leave type.                                                   |
| **Notice Period**      | Minimum number of calendar days in advance an employee must submit a leave request before the start date.                                                        |
| **Decline Reason**     | A mandatory text field the approver must complete when declining a leave request, recorded for audit purposes.                                                   |
