# Current Feature Context

**Feature Name**: Bugfix — `MainButton` variant `"accent"` not assignable to shadcn `Button` variant type
**Status**: Done
**Phase**: Bugfix
**Started**: 2026-05-03
**Completed**: 2026-05-03

---

## Summary

The `MainButton` component's `Variant` type union included `'accent'` but the underlying
shadcn `Button` component's `buttonVariants` (cva) never defined a plain `'accent'` variant
— only `'accentOutline'`. This caused TS2322 errors at all 3 places where `MainButton`
passes `variant` to the `<Button>`.

## Root Cause

`packages/ui/src/lib/button/index.tsx:28` declared `'accent'` in the `Variant` type union,
but `packages/ui/src/components/button.tsx:12-34` (the `buttonVariants` cva object) has no
`accent` key — only `accentOutline`.

## Fix

1. **`packages/ui/src/lib/button/index.tsx`** — Removed `'accent'` from the `Variant` type.
   `'accentOutline'` remains (it has a valid cva variant definition).

2. **`src/components/shared/navbar/index.tsx:30`** — Changed the single `variant={'accent'}`
   usage (user profile button) to `variant={'ghost'}` — already used nearby for "Contact Me".

## Files Changed

1. `packages/ui/src/lib/button/index.tsx` — removed `'accent'` from `Variant` type union
2. `apps/user-dashboard/src/components/shared/navbar/index.tsx` — changed `accent` to `ghost`
