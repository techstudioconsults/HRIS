---
section: product
topic: user-story
id: US-004
epic: EPIC-001
version: 1.0
created: 2026-04-29
---

# US-004 — Welcome Tour (Welcome Page)

## Story

As a new company owner, I want to take an optional tour of the platform so that I
understand the key features before starting the onboarding setup.

## Acceptance Criteria

- [ ] The welcome page (`/onboarding/welcome`) renders a heading and exactly two primary actions:
      "Take a Quick Tour" and "Skip Tour & Continue".
- [ ] "Skip Tour & Continue" navigates directly to `/onboarding/step-1` without opening a modal or tour overlay.
- [ ] "Take a Quick Tour" opens the guided tour overlay (via `useTour().startTour`).
- [ ] The tour overlay can be dismissed at any point without blocking navigation to step-1.
- [ ] Completing the tour OR dismissing it both navigate to `/onboarding/step-1`.
- [ ] The welcome page renders correctly for an authenticated user whose `takenTour` flag is `false`.

## Flow

```
/onboarding/welcome
  Render: heading + two CTA buttons

  "Skip Tour & Continue":
    router.push('/onboarding/step-1')

  "Take a Quick Tour":
    useTour().startTour(tourSteps)
    Tour overlay rendered; user can step through or dismiss
    On complete / dismiss → router.push('/onboarding/step-1')
```

## Error Cases

| Scenario                     | UI Behaviour                                                 |
| ---------------------------- | ------------------------------------------------------------ |
| Tour config fails to load    | Log error silently; fall back to direct navigation to step-1 |
| User navigates away mid-tour | Tour overlay closes; no state corruption                     |
