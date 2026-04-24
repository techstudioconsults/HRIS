---
section: architecture
topic: data-flow
---

# User Payslip — Data Flow

## Read Flow (List)

```
Browser
  └─▶ PayslipPage mounts
        └─▶ useQuery(['user', 'payslips'], UserPayslipService.list)
              └─▶ HttpAdapter.get('/api/v1/payslips?page=1&size=20')
                    └─▶ Backend validates JWT → returns employee-scoped list
              ◀── PaginatedPayslipListResponse
        └─▶ PayslipSummaryCard ← data[0].netPay
        └─▶ PayslipGrid ← data[]
```

## Read Flow (Detail on Modal Open)

```
User clicks "View" on PayslipItemCard
  └─▶ setSelectedPayslipId(id)
        └─▶ PayslipDetailsModal mounts / becomes visible
              └─▶ useQuery(['user', 'payslips', id], UserPayslipService.getById)
                    └─▶ HttpAdapter.get('/api/v1/payslips/:id')
                          └─▶ Backend validates JWT + ownership
                    ◀── PayslipDetailResponse
              └─▶ Renders PayslipBreakdown (earnings), PayslipBreakdown (deductions), totals
```

## Download Flow

```
User clicks "Download PDF"
  └─▶ PayslipDownloadButton calls UserPayslipService.downloadPdf(id)
        └─▶ HttpAdapter.get('/api/v1/payslips/:id/download', { responseType: 'blob' })
              └─▶ Backend streams pre-signed or server-rendered PDF
        ◀── Blob
  └─▶ URL.createObjectURL(blob)
  └─▶ <a href={url} download="payslip-{period}.pdf"> .click()
  └─▶ URL.revokeObjectURL(url)   ← immediate cleanup
```

## Query Cache Behaviour

| Query Key                  | staleTime | Cache Lifetime      | Notes                                     |
| -------------------------- | --------- | ------------------- | ----------------------------------------- |
| `['user', 'payslips']`     | 60s       | gcTime default (5m) | Re-fetches on window focus after stale    |
| `['user', 'payslips', id]` | 60s       | gcTime default (5m) | Fetched on demand; payslips are immutable |
| Download blob              | —         | Not cached          | Side-effectful; always fresh              |

## Error Propagation

```
API error (4xx / 5xx)
  └─▶ HttpAdapter interceptor
        ├── 401 → tokenManager.refresh() → retry once → signOut + redirect
        └── Other → throws ApiError
              └─▶ TanStack Query isError = true
                    └─▶ PayslipGrid / PayslipDetailsModal renders error toast
```
