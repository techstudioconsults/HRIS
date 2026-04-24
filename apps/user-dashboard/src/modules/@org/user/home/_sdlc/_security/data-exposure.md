# User Home — Data Exposure

_What employee data is exposed on the home dashboard and what must never be shown._

## Data Rendered on the Home Dashboard

| Data                | Field       | Sensitivity | Notes                                                |
| ------------------- | ----------- | ----------- | ---------------------------------------------------- |
| Employee first name | `firstName` | Low         | Used in welcome header only                          |
| Activity type       | `type`      | Low         | Enum value, not personal data                        |
| Activity title      | `title`     | Low         | Human-readable event label                           |
| Activity message    | `message`   | Medium      | Must be sanitised; no internal IDs or system details |
| Activity timestamp  | `timestamp` | Low         | Relative time display                                |
| Setup task status   | `status`    | Low         | `pending`/`completed`/`locked` only                  |

## Data That Must NOT Appear on the Home Dashboard

- Salary figures or net pay amounts
- National ID, passport, or tax numbers
- Performance ratings or disciplinary records
- Other employees' data of any kind
- Backend error messages, stack traces, or internal system IDs

## XSS Prevention

- All activity `message` and `title` values must be rendered as text content, not as HTML (`innerHTML`).
- React's default JSX rendering escapes strings automatically — no `dangerouslySetInnerHTML` usage in this module.
