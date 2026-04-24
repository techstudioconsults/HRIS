---
section: overview
topic: glossary
---

# Admin Teams — Glossary

| Term                   | Definition                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Team**               | An organisational unit grouping employees under a shared purpose, department, or project.                            |
| **Role**               | A named permission set within a team (e.g. Manager, Lead, Member, Observer). Different from system-level RBAC roles. |
| **Member**             | An employee assigned to a specific team with a role.                                                                 |
| **Custom Permissions** | Per-member permission overrides that extend or restrict the role's default permissions.                              |
| **Workflow Dialog**    | The multi-step guided modal sequence: create Team → create Role → assign Employee.                                   |
| **Standalone Mode**    | Opening a dialog in isolation (edit or delete) without advancing the sequential workflow.                            |
| **Sub-team**           | A nested team that belongs to a parent team. Shares the same data model; hierarchy is organisational, not technical. |
| **Export**             | Blob download of the team roster in CSV/Excel format via `GET /teams/export`.                                        |
| **Manager**            | The default highest-privilege role within a team (`read, write, manage, delete`).                                    |
| **Observer**           | The default read-only role within a team.                                                                            |
