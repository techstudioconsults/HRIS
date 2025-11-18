# Animation Component Analysis

## Overview
The animation component in `/src/lib/animation/index.tsx` provides a suite of reusable animation utilities for creating smooth, performant page transitions and entrance animations using CSS transitions and Intersection Observer API.

## Key Components

### 1. **useWaveAnimation Hook**
A custom hook that manages staggered entrance animations for child elements.

**Features:**
- Uses Intersection Observer API for viewport detection
- Staggered animation delays for cascading effects
- Customizable duration and easing
- Respects `prefers-reduced-motion` for accessibility
- Provides `getItemStyle` and `getItemClassName` utilities

**Options:**
```typescript
{
  threshold?: number;        // Intersection Observer threshold (default: 0.1)
  rootMargin?: string;       // Intersection Observer margin (default: "50px")
  staggerDelay?: number;     // Delay between items in ms (default: 50)
  duration?: number;         // Animation duration in ms (default: 500)
}
```

**Return Values:**
- `isVisible`: boolean indicating if element is in viewport
- `containerReference`: ref to attach to container
- `getItemStyle`: function to get animation styles for indexed items
- `getItemClassName`: function to get animation classes for items

---

### 2. **PageWrapper Component**
A context provider that wraps page content to enable staggered animations.

**Usage:**
```tsx
<PageWrapper staggerDelay={50} duration={600}>
  <PageSection index={0}>Item 1</PageSection>
  <PageSection index={1}>Item 2</PageSection>
</PageWrapper>
```

**Props:**
- `children`: React elements to animate
- `className`: Additional CSS classes
- `staggerDelay`: Delay between items (default: 50ms)
- `duration`: Animation duration (default: 600ms)
- `threshold`: Intersection Observer threshold
- `rootMargin`: Intersection Observer margin

---

### 3. **PageSection Component**
Child component that renders animated sections.

**Props:**
- `index`: Position in animation sequence (0-based)
- `children`: Content to animate
- `className`: Additional CSS classes

---

### 4. **PageTransition Component**
Advanced wrapper for full-page transitions on route changes. Works seamlessly with Next.js App Router.

**Features:**
- Multiple animation variants: fade, slideUp, slideDown, slideLeft, slideRight, scale, wipe
- Automatic route change detection
- Optional overlay effects for "wipe" variant
- Blur support for overlay
- Respects `prefers-reduced-motion`
- Lifecycle callbacks (onStart, onEnd)

**Variants:**
| Variant | Effect |
|---------|--------|
| `fade` | Fade in from transparent |
| `slideUp` | Slide up from bottom |
| `slideDown` | Slide down from top |
| `slideLeft` | Slide in from right |
| `slideRight` | Slide in from left |
| `scale` | Scale up from 98% |
| `wipe` | Horizontal overlay wipe effect |
| `none` | No animation |

**Usage:**
```tsx
<PageTransition variant="wipe" duration={700}>
  {children}
</PageTransition>
```

**Props:**
- `variant`: Animation type (default: "fade")
- `duration`: Duration in ms (default: 600)
- `easing`: CSS timing function (default: cubic-bezier(0.22, 1, 0.36, 1))
- `overlayColor`: Color for wipe variant (default: "var(--background)")
- `disabled`: Disable animations (default: false)
- `initial`: Animate on first mount (default: true)
- `blur`: Blur amount for overlay in px (default: 0)
- `onStart`: Callback when animation starts
- `onEnd`: Callback when animation ends
- `className`: Additional CSS classes

---

## Animation Utilities

### **getEnterFromStyle(variant)**
Returns initial CSS styles for each variant type.

### **getEnterToStyle()**
Returns final CSS styles (opacity: 1, no transform).

### **usePrefersReducedMotion()**
Hook that detects user's motion preferences and disables animations accordingly.

---

## Performance Considerations

✅ **Optimizations:**
- Uses `willChange` CSS property for GPU acceleration
- Leverages `requestAnimationFrame` for smooth timing
- Intersection Observer for efficient viewport detection
- Respects `prefers-reduced-motion` for accessibility
- Uses CSS transitions (GPU-accelerated) instead of JavaScript animations

---

## Accessibility Features

- ✅ Respects `prefers-reduced-motion` media query
- ✅ No forced animations that degrade user experience
- ✅ Smooth, natural motion curves
- ✅ No layout shifts or visual jank

---

## Use Cases

1. **Page Transitions**: Wrap layout component with `PageTransition`
2. **Staggered Entrances**: Use `PageWrapper` + `PageSection` for list animations
3. **Loading States**: Animate elements as they become visible
4. **Route Transitions**: Automatic animations on navigation
5. **Custom Transitions**: Combine multiple components for complex effects

