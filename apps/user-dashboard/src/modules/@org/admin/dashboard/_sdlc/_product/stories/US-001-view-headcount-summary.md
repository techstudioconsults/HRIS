# US-001 — View Headcount and Attendance Summary

_As an HR administrator, I want to see the total headcount and current attendance rate on the dashboard so I can immediately understand the workforce status without navigating to the employee list._

## Context

This is the primary metric card visible at the top of the dashboard. It answers the two most common questions an admin asks at the start of the working day: "How many people do we have?" and "Are people showing up?"

## Acceptance Criteria

- See AC-001 for full criteria

## Definition of Done

- [ ] Headcount widget renders total, active, on-leave, and terminated-this-month counts
- [ ] Attendance rate widget shows a percentage and a sparkline for the last 5 pay periods
- [ ] Skeleton loader displayed while data is fetching
- [ ] Empty/error state shown if the API returns a non-2xx response
- [ ] Values update on page focus if data is older than 5 minutes (TanStack Query staleTime)

## Design Reference

See `_sdlc/_design/figma-links.md` for the Figma frame link.

## Notes

- Attendance rate calculation is done server-side; the frontend only renders the value
- The "terminated this month" count uses MTD; the label must clarify this to avoid confusion
