---
section: api
topic: endpoints
---

# User Payslip — API Reference

All endpoints require a valid `Authorization: Bearer <token>` header. The backend scopes all responses to the authenticated employee's `employeeId` derived from the JWT — no `employeeId` parameter is accepted from the client.

Base: `/api/v1`

---

## GET /payslips

Retrieve a paginated list of the authenticated employee's finalized payslips.

**Query Parameters**

| Param  | Type   | Default | Description             |
| ------ | ------ | ------- | ----------------------- |
| `page` | number | `1`     | Page number (1-indexed) |
| `size` | number | `20`    | Items per page          |

**Response 200**

```json
{
  "status": "success",
  "data": [
    {
      "id": "ps_01HX...",
      "period": "2025-06",
      "periodLabel": "June 2025",
      "netPay": 450000,
      "status": "FINALIZED",
      "generatedAt": "2025-06-30T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "size": 20,
    "totalPages": 1
  }
}
```

**Error Responses**

| Status | Scenario                         |
| ------ | -------------------------------- |
| `401`  | Session expired or token invalid |
| `500`  | Server error                     |

---

## GET /payslips/:id

Retrieve the full detail of a single payslip including line items.

**Response 200**

```json
{
  "status": "success",
  "data": {
    "id": "ps_01HX...",
    "employeeId": "emp_01",
    "period": "2025-06",
    "periodLabel": "June 2025",
    "grossPay": 500000,
    "totalDeductions": 50000,
    "netPay": 450000,
    "status": "FINALIZED",
    "earnings": [
      { "id": "el_01", "label": "Basic Salary", "amount": 450000 },
      { "id": "el_02", "label": "Housing Allowance", "amount": 50000 }
    ],
    "deductions": [
      { "id": "dl_01", "label": "PAYE Tax", "amount": 35000 },
      { "id": "dl_02", "label": "Pension (Employee)", "amount": 15000 }
    ],
    "generatedAt": "2025-06-30T12:00:00Z"
  }
}
```

**Error Responses**

| Status | Scenario                            |
| ------ | ----------------------------------- |
| `401`  | Session expired                     |
| `403`  | Payslip belongs to another employee |
| `404`  | Payslip not found                   |

---

## GET /payslips/:id/download

Download the payslip as a PDF. Returns a binary blob.

**Response 200**

- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="payslip-2025-06.pdf"`
- Body: PDF binary stream

**Error Responses**

| Status | Scenario              |
| ------ | --------------------- |
| `401`  | Session expired       |
| `404`  | Payslip not found     |
| `500`  | PDF generation failed |
