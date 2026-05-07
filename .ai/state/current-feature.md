# Current Feature Context

**Feature Name**: Preferences Tab — Active Button Styling (Ring vs Border)
**Status**: Complete
**Phase**: Done
**Started**: 2026-05-07

## Summary

The Preferences tab uses thick `border-2 border-primary` to indicate the active/selected button
in all four sections (Accent Color, Mode, Sidebar Layout, Collapse Mode). The active state
should use a focus-style `ring-2 ring-primary` instead of a colored border.

## Repro Steps

1. Navigate to Settings > Preferences tab
2. Click any button in Accent Color, Mode, Sidebar Layout, or Collapse Mode
3. Observe: selected button shows `border-2 border-primary` (thick colored border)
4. Expected: selected button should show `ring-2 ring-primary` (focus-like ring appearance)

## Root Cause

- `preferences-settings-tab.tsx` uses `border-2` as the base border width on all toggle button groups
- Selected state indicator is `border-primary` (colored border), not a ring
- Hover state is `hover:border-primary/50` (border-based)
- Collapse Mode section is missing `focus-visible` ring classes entirely
- All 4 button groups affected: Accent Color (L135-139), Mode (L173-177), Sidebar Layout (L228-232), Collapse Mode (L264-267)
