# Tour Guide Migration: react-joyride → driver.js

## Issue Resolved
**Problem**: `react-joyride@2.9.3` is not compatible with React 19. It uses deprecated React DOM methods (`unmountComponentAtNode`, `unstable_renderSubtreeIntoContainer`) that were removed in React 19.

**Solution**: Migrated to `driver.js@1.4.0`, a modern, lightweight, and React 19-compatible tour library.

## Changes Made

### 1. Package Changes
```bash
# Removed
- react-joyride@2.9.3
- @types/react-joyride@2.0.5

# Added
+ driver.js@1.4.0
```

### 2. Files Modified

#### `/src/modules/@org/onboarding/context/tour-context.tsx`
- Replaced react-joyride with driver.js
- Updated interface to use `DriveStep` instead of `Step`
- Implemented driver instance management with useRef
- Added proper cleanup on unmount

#### `/src/modules/@org/onboarding/config/tour-steps.ts`
- Converted from react-joyride `Step` format to driver.js `DriveStep` format
- Updated structure:
  - `target` → `element`
  - `content` → `popover.description`
  - `placement` → `popover.side`
  - Added `popover.title` for better UX

#### `/src/styles/driver-custom.css` (NEW)
- Custom styling to match your theme
- White background with black text
- Primary color for action buttons
- Responsive spacing and layout

### 3. API Differences

#### react-joyride → driver.js Mapping

| react-joyride | driver.js |
|---------------|-----------|
| `target: '[selector]'` | `element: '[selector]'` |
| `content: 'text'` | `popover: { description: 'text' }` |
| `placement: 'bottom'` | `popover: { side: 'bottom' }` |
| `disableBeacon: true` | (not needed - no initial tour) |
| Step without target (center) | Step without `element` property |

### 4. Features Retained

✅ **Spotlight Effect** - Elements are highlighted with darkened overlay
✅ **Progress Indicator** - Shows current step (e.g., "Step 2 of 9")
✅ **Navigation Controls** - Back, Next, Close buttons
✅ **Keyboard Support** - ESC to close, arrows to navigate
✅ **Auto-scroll** - Automatically scrolls to highlighted elements
✅ **Mobile Responsive** - Adapts to all screen sizes
✅ **Theme Integration** - Uses your CSS variables

### 5. New Benefits with driver.js

🎉 **React 19 Compatible** - No deprecated APIs
🎉 **Smaller Bundle** - ~10KB vs 50KB+ (react-joyride)
🎉 **Better Performance** - No React component overhead
🎉 **Modern API** - Cleaner, more intuitive
🎉 **Active Maintenance** - Regular updates and bug fixes
🎉 **Framework Agnostic** - Can be used outside React too

## Usage (No Changes Needed)

The tour hook API remains the same:

```tsx
const { startTour, setTourSteps, stopTour } = useTour();

const handleStartTour = () => {
  setTourSteps(welcomeTourSteps);
  startTour();
};
```

All existing `data-tour` attributes work exactly the same.

## Testing Checklist

- [x] Build completes without errors
- [x] No TypeScript errors
- [x] Tour starts correctly on all pages
- [x] Navigation buttons work (Back/Next/Close)
- [x] Spotlight highlights correct elements
- [x] Progress indicator shows correctly
- [x] Mobile responsive
- [x] Theme colors applied correctly

## Additional Resources

- [driver.js Documentation](https://driverjs.com/)
- [driver.js GitHub](https://github.com/kamranahmedse/driver.js)
- [Migration Guide](https://driverjs.com/docs/migration)

## Rollback (If Needed)

If issues arise, the old files are preserved:
- `tour-context-old.tsx` - Original react-joyride context
- `tour-steps-old.ts` - Original step configurations

To rollback:
```bash
pnpm add react-joyride @types/react-joyride
mv src/modules/@org/onboarding/context/tour-context-old.tsx src/modules/@org/onboarding/context/tour-context.tsx
mv src/modules/@org/onboarding/config/tour-steps-old.ts src/modules/@org/onboarding/config/tour-steps.ts
pnpm remove driver.js
```
