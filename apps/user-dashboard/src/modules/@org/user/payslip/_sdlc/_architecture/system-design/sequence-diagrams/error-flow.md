---
section: architecture
topic: sequence-diagram-error-flow
---

# User Payslip — Error Flow (Sequence Diagram)

## 401 — Session Expired During List Fetch

```
Browser       TanStack Query    HttpAdapter         tokenManager        NextAuth
   |                |                |                    |                  |
   |                |-- fetchFn() ──▶|                    |                  |
   |                |                |-- GET /payslips ──▶|                  |
   |                |                |◀── 401 ────────────|                  |
   |                |                |-- refresh() ──────▶|                  |
   |                |                |                    |-- POST /refresh ─▶|
   |                |                |                    |◀── 401 (expired) ─|
   |                |                |-- invalidate() ────▶|                  |
   |                |                |-- signOut() ───────────────────────────▶|
   |                |                |-- redirectToLogin()                      |
   |◀── /login ─────────────────────────────────────────────────────────────── |
```

## 404 — Payslip Detail Not Found

```
Browser       PayslipDetailsModal   TanStack Query    Backend API
   |                   |                  |                 |
   |-- click View ────▶|                  |                 |
   |                   |-- useQuery id ──▶|                 |
   |                   |                  |-- GET /payslips/:id ─▶|
   |                   |                  |◀── 404 ─────────|
   |                   |◀── isError ──────|                 |
   |                   |-- toast "Payslip not found."       |
   |                   |-- modal stays closed               |
   |◀── toast displayed|                  |                 |
```

## 500 — Server Error During Download

```
Browser       PayslipDownloadButton   UserPayslipService   Backend API
   |                   |                     |                  |
   |-- click Download ▶|                     |                  |
   |                   |-- downloadPdf(id) ─▶|                  |
   |                   |                     |-- GET /payslips/:id/download ─▶|
   |                   |                     |◀── 500 ──────────|
   |                   |◀── throw ApiError ──|                  |
   |                   |-- toast "Something went wrong. Please try again."    |
   |                   |-- spinner cleared   |                  |
   |◀── toast displayed|                     |                  |
```
