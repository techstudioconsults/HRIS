# Payroll Management — Glossary

_Ubiquitous language for the payroll bounded context — all team members and agents must use these terms consistently._

## Terms

| Term                         | Definition                                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pay Cycle**                | The recurring period for which payroll is calculated: Weekly, Bi-Weekly, or Monthly.                                                                |
| **Pay Period**               | A specific instance of a pay cycle, defined by a start date and end date (e.g. 1–31 May 2026).                                                      |
| **Pay Day**                  | The calendar day of the month (or relative rule) on which net pay is disbursed to employees.                                                        |
| **Payroll Run**              | A single execution of the payroll calculation for all employees in a pay period. Has lifecycle: `draft → processing → completed → approved → paid`. |
| **Gross Pay**                | Total employee earnings before any deductions for a pay period. Includes base salary and approved bonuses.                                          |
| **Net Pay**                  | Gross pay minus all deductions for the pay period. This is the amount disbursed to the employee.                                                    |
| **Deduction**                | A reduction from gross pay. Can be statutory (PAYE income tax, pension, NHF) or voluntary (loan repayment, salary advance).                         |
| **Bonus**                    | An additional payment on top of base salary, added to gross pay. Can be one-off (performance) or recurring (allowance).                             |
| **Payslip**                  | A per-employee document for a specific payroll run showing gross pay, each deduction, and net pay.                                                  |
| **Payroll Approval**         | The act of an authorised HR admin confirming that a completed payroll run is correct before disbursement.                                           |
| **Wallet**                   | The organisation's internal funding account from which employee pay is disbursed. Must have sufficient balance before a payroll run can be paid.    |
| **Wallet Funding**           | The process of transferring money from the organisation's bank account into the HRIS wallet.                                                        |
| **SSE (Server-Sent Events)** | A one-directional HTTP stream from the backend to the frontend used to push payroll run progress notifications in real time.                        |
| **Pay Schedule**             | A pre-configured instruction to automatically trigger a payroll run at a specific future date and time.                                             |
| **Setup Wizard**             | A guided multi-step form shown to HR admins on first payroll configuration to set up pay cycle, pay day, and bank details.                          |
| **PAYE**                     | Pay As You Earn — statutory income tax deducted at source from employee salary.                                                                     |
| **Pension**                  | Mandatory employer and employee retirement contribution (e.g. 8% employee + 10% employer under Nigerian PRA 2014).                                  |
| **NHF**                      | National Housing Fund — statutory deduction (2.5% of basic salary) for eligible employees.                                                          |
