# Admin Employee Module — Glossary

_Ubiquitous language for the employee management bounded context._

## Terms

| Term                  | Definition                                                                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Employee**          | A person who has a formal employment relationship with the organisation, represented by an active or historical employee record in the HRIS.             |
| **Employee Record**   | The complete set of stored information about an employee: personal info, contact details, role, department, contract, documents, and employment history. |
| **Contract Type**     | The nature of the employment agreement: `FULL_TIME`, `PART_TIME`, `CONTRACT`, or `INTERN`.                                                               |
| **Employment Status** | The current state of an employee's engagement: `ACTIVE`, `INACTIVE`, `TERMINATED`, or `ON_PROBATION`.                                                    |
| **Department**        | An organisational unit (e.g., Engineering, Finance, Operations) to which an employee is assigned. Departments are managed in the `settings` module.      |
| **Role**              | The job title or position assigned to an employee within a department (e.g., Senior Engineer, Payroll Officer).                                          |
| **Effective Date**    | The date from which a status change, role change, or department transfer takes effect — may differ from the date the change was recorded in the system.  |
| **kbar**              | A keyboard command palette library integrated into the admin dashboard; allows power users to trigger common employee actions via keyboard shortcuts.    |
| **Document Expiry**   | The date on which a tracked employee document (e.g., work permit, certification) becomes invalid; the system raises alerts before expiry.                |
| **Audit Trail**       | An immutable, chronological log of all changes made to an employee record, including who made the change and when.                                       |
| **Profile View**      | The read-only screen showing all information about a specific employee, including cross-module data (leave history, payroll summary).                    |

## Acronyms

| Acronym  | Expansion                                        |
| -------- | ------------------------------------------------ |
| **HRIS** | Human Resource Information System                |
| **PII**  | Personally Identifiable Information              |
| **NIN**  | National Identification Number (Nigeria context) |
| **BVN**  | Bank Verification Number (Nigeria context)       |
