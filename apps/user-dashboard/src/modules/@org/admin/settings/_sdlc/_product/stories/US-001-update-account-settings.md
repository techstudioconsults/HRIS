# US-001 — Update Organisation Account Settings

_As an HR admin, I want to update the organisation's name, logo, and contact details so that the HRIS reflects accurate company information._

## Story

**As an** HR admin,
**I want to** edit the organisation's account settings (name, logo, contact email, phone, address, registration number),
**So that** all system communications and documents reflect accurate company identity.

## Acceptance Criteria

- [ ] Account Settings tab loads with current organisation values pre-filled in the form.
- [ ] HR admin can update the organisation name (max 200 characters, required).
- [ ] HR admin can upload a new logo (PNG/JPG, max 2 MB; preview shown before save).
- [ ] HR admin can update contact email, phone number, and registered address.
- [ ] Clicking "Save Changes" persists the updates and shows a success toast.
- [ ] On API error, the form retains the entered values and shows an error toast.
- [ ] All changes record `updatedBy` (current user ID) and `updatedAt`.

## Edge Cases

- Uploading a logo larger than 2 MB shows a client-side error before any API call.
- If org name is cleared and saved, inline validation blocks the save.
- Concurrent edits from two admin sessions — last write wins; no optimistic locking in v1.

## Related

- EPIC-001
- AC-001-account-settings-validation
