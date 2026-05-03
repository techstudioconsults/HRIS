# Current Feature Context

**Feature Name**: Sub-team Feature Parity
**Status**: ✅ Done
**Completed**: 2026-05-03

---

## Summary

The sub-team module now has full feature parity with the team module:

- Sub-team row actions (in sub-teams tab of team details): Add Role, Add Members
- Sub-team details page: Add Employee (all employees, via `AddNewEmployees`), Add Role
- All mutations use the same endpoints as team (`POST /teams/:id/employees`, `POST /roles`)

Previous incomplete feature (HR Employee Bulk Import) was completed on 2026-05-02.
