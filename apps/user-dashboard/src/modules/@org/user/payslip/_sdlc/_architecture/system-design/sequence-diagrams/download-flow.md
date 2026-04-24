---
section: architecture
topic: sequence-diagram-download-flow
---

# User Payslip — PDF Download Flow (Sequence Diagram)

> This module is read-only (no mutations). The "mutation-equivalent" operation is PDF download — it is an effectful side operation that triggers a file download without modifying server state.

## Happy Path

```
Browser       PayslipDownloadButton   UserPayslipService   HttpAdapter       Backend API
   |                   |                     |                  |                 |
   |-- click Download ▶|                     |                  |                 |
   |                   |-- aria-busy=true    |                  |                 |
   |                   |-- downloadPdf(id) ─▶|                  |                 |
   |                   |                     |-- get(url, blob) ▶|                |
   |                   |                     |                  |-- GET /payslips/:id/download ─▶|
   |                   |                     |                  |◀── 200 PDF blob ─|
   |                   |                     |◀── Blob ─────────|                 |
   |                   |◀── Blob ────────────|                  |                 |
   |                   |-- createObjectURL() |                  |                 |
   |                   |-- <a>.click()       |                  |                 |
   |                   |-- revokeObjectURL() |                  |                 |
   |                   |-- aria-busy=false   |                  |                 |
   |◀── file saved ────|                     |                  |                 |
```

## Blob Lifecycle (Memory Safety)

```
1. blob = await response.blob()
2. url  = URL.createObjectURL(blob)
3. a    = document.createElement('a')
4. a.href = url; a.download = `payslip-{period}.pdf`
5. document.body.appendChild(a); a.click(); document.body.removeChild(a)
6. URL.revokeObjectURL(url)   ← must happen synchronously after click
```

The URL is revoked immediately. The browser has already queued the download at click time; revocation only releases the object URL from memory — it does not cancel the download.
