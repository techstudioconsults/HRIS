# AC-001: Leave Request Submission

_Acceptance criteria for the employee leave request submission flow._

## Preconditions

- The employee is authenticated and has at least one leave type available.
- The `POST /leave-request` endpoint is reachable.

## Criteria

| #   | Given                                 | When                                                               | Then                                                                                                                                                    |
| --- | ------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Employee is on `/user/leave`          | They click "Request Leave"                                         | The `RequestLeaveModal` opens                                                                                                                           |
| 2   | Modal is open                         | Employee submits with empty fields                                 | Zod validation errors appear inline: "Please select a leave type", "Please select a start date", "Please select an end date", "Please provide a reason" |
| 3   | Modal is open                         | Employee selects leave type, valid date range, and provides reason | The submit button becomes active                                                                                                                        |
| 4   | Employee submits valid form           | `POST /leave-request` returns 201                                  | Modal closes; `LeaveRequestSubmittedModal` opens                                                                                                        |
| 5   | `LeaveRequestSubmittedModal` is open  | Employee closes it                                                 | Modal closes; leave request list refreshes to show new pending request                                                                                  |
| 6   | `POST /leave-request` returns 4xx/5xx | Error response received                                            | Error toast/message displayed; form remains open                                                                                                        |
| 7   | Employee attaches a document          | File is valid                                                      | Document is included in the `FormData` payload as the `document` field                                                                                  |

## Definition of Done

- All criteria pass in unit and integration tests.
- `requestLeaveSchema` Zod validation is tested for each invalid field.
- No TypeScript strict-mode errors.
