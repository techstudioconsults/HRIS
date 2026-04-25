---
section: product
topic: user-story
id: US-001
---

# US-001 — Complete Company Profile (Step 1)

## Story

As a company owner, I want to set up my company's profile so that the HRIS reflects my organization's name, industry, and location.

## Acceptance Criteria

- [ ] Form pre-fills with any data already saved from registration (company name, domain).
- [ ] All required fields validated before submit (name, industry, size, address line 1, city, country).
- [ ] Saving navigates to Step 2.
- [ ] On back-navigation to Step 1, the saved data is still present.
- [ ] Submit button disabled while PATCH is in flight.

## Error Cases

| Error            | UI Behaviour                                               |
| ---------------- | ---------------------------------------------------------- |
| 422 Validation   | Field-level errors mapped from backend response            |
| 500 Server error | Root error toast "Something went wrong. Please try again." |
