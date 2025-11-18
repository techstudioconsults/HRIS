# Animation Component Implementation Guide

## ✅ Implementation Complete

The animation component has been successfully integrated into the auth login page.

---

## What Changed

### Modified File: `/src/modules/@org/auth/_views/login/index.tsx`

**Added:**
- Import of `PageWrapper` and `PageSection` from `@/lib/animation`
- Wrapped entire login form with `PageWrapper` component
- Wrapped each major section with `PageSection` for staggered animations

**Animation Structure:**

```
PageWrapper (container with animation context)
├── PageSection 0: Header (Welcome Back, HR)
├── PageSection 1: Login Form (email, password, forgot password link)
├── PageSection 2: Divider (OR)
├── PageSection 3: OTP Login Button
└── PageSection 4: Sign Up Link
```

**Configuration:**
- `staggerDelay`: 100ms (delay between each section)
- `duration`: 600ms (animation duration per section)

---

## Animation Effect

**What You'll See:**
1. **Header fades in** and slides up (0ms)
2. **Form inputs fade in** and slide up (100ms delay)
3. **Divider fades in** and slides up (200ms delay)
4. **OTP button fades in** and slides up (300ms delay)
5. **Sign up link fades in** and slides up (400ms delay)

The entire sequence takes ~1000ms total, creating a smooth cascading entrance effect as the user lands on the login page.

---

## How It Works

### PageWrapper Component
- Creates animation context for all child sections
- Manages intersection observer for viewport detection
- Provides animation styles and classes to children
- Uses `useWaveAnimation` hook internally

### PageSection Component
- Receives an index prop to determine animation delay
- Uses context from PageWrapper to apply animations
- Delay = `index × staggerDelay`
- Each section animates: **opacity 0→1** and **translateY 8px→0**

### Animation Timeline
```
Time (ms) │ Section │ Animation State
──────────┼─────────┼──────────────────────────
0         │ 0       │ Start animation
100       │ 1       │ Start animation
200       │ 2       │ Start animation
300       │ 3       │ Start animation
400       │ 4       │ Start animation
600-1000  │ All     │ Complete animations
```

---

## Customization Options

### Adjust Animation Timing

Modify the `PageWrapper` props to customize animations:

```tsx
<PageWrapper 
  staggerDelay={50}    // Faster cascading effect (50ms between items)
  duration={800}       // Slower animation (800ms per section)
  threshold={0.2}      // Trigger animation when 20% visible
  rootMargin="100px"   // Trigger animation 100px before entering viewport
>
  {/* sections */}
</PageWrapper>
```

### Change Animation Variant

Use `PageTransition` for full-page route transitions:

```tsx
// In app/[locale]/layout.tsx or similar
<PageTransition variant="wipe" duration={700}>
  {children}
</PageTransition>
```

**Available variants:**
- `fade` - Simple opacity fade
- `slideUp` - Slide up from bottom
- `slideDown` - Slide down from top
- `slideLeft` - Slide in from right
- `slideRight` - Slide in from left
- `scale` - Scale up from 98%
- `wipe` - Horizontal overlay wipe
- `none` - No animation

---

## Additional Sections to Animate

### Update Register Page
Apply the same pattern to `/src/modules/@org/auth/_views/register/index.tsx`:

```tsx
import { PageSection, PageWrapper } from "@/lib/animation";

export const Register = () => {
  return (
    <PageWrapper staggerDelay={100} duration={600} className="mx-auto max-w-[527px]">
      <PageSection index={0} className="mb-8 space-y-2">
        {/* Header content */}
      </PageSection>
      <PageSection index={1}>
        {/* Form content */}
      </PageSection>
      {/* More sections as needed */}
    </PageWrapper>
  );
};
```

### Apply to Other Auth Views
- `forgot-password` - Wrap heading and form with PageWrapper/PageSection
- `reset-password` - Same pattern
- `otp-login` - Same pattern

### Update Main Layout
Add `PageTransition` to the main app layout for page-level transitions:

```tsx
// src/app/[locale]/layout.tsx
import { PageTransition } from "@/lib/animation";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PageTransition variant="fade" duration={600}>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
```

---

## Accessibility

The animation component automatically:
- ✅ Detects `prefers-reduced-motion` user setting
- ✅ Disables animations for users who prefer reduced motion
- ✅ Uses GPU-accelerated CSS transforms (no layout shifts)
- ✅ Maintains full functionality without animations

Users can disable animations in their OS settings:
- **macOS**: System Preferences → Accessibility → Display → Reduce motion
- **Windows**: Settings → Ease of Access → Display → Show animations
- **Linux**: Similar accessibility settings

---

## Performance Impact

**Optimizations included:**
- CSS transitions (GPU accelerated)
- `willChange` property for performance
- Intersection Observer (efficient viewport detection)
- No JavaScript animation loops
- No layout thrashing

**Performance characteristics:**
- ✅ Smooth 60fps animations
- ✅ Minimal memory usage
- ✅ No impact on page load performance
- ✅ Deferred until page interactive

---

## Testing

### Manual Testing
1. Open login page: `/login`
2. You should see elements fade in and slide up sequentially
3. Each element appears 100ms after the previous one
4. Total animation duration: ~1000ms

### Test with Reduced Motion
1. Enable "Reduce motion" in OS accessibility settings
2. Reload login page
3. Elements should appear instantly without animations

### Browser DevTools
In Chrome DevTools (Rendering tab):
- Check "Highlight changes" to see which elements animate
- Use Performance tab to confirm 60fps animations

---

## Next Steps

1. **Apply to other auth pages** - Use the same pattern for Register, Forgot Password, Reset Password, and OTP Login
2. **Add page-level transitions** - Wrap main layout with `PageTransition` for route changes
3. **Fine-tune timing** - Adjust `staggerDelay` and `duration` based on your design preferences
4. **Test accessibility** - Verify animations work correctly with reduced motion enabled

---

## Files Reference

| File | Purpose |
|------|---------|
| `/src/lib/animation/index.tsx` | Animation utilities (no changes needed) |
| `/src/modules/@org/auth/_views/login/index.tsx` | Login page (✅ UPDATED) |
| `/src/modules/@org/auth/_views/register/index.tsx` | Register page (ready to update) |
| `/src/modules/@org/auth/_views/forgot-password/index.tsx` | Forgot password (ready to update) |
| `/src/modules/@org/auth/_views/reset-password/index.tsx` | Reset password (ready to update) |
| `/src/modules/@org/auth/_views/login/otp-login.tsx` | OTP login (ready to update) |

