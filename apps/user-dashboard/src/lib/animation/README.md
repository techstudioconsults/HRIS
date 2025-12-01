# Animation Utilities (Wave + Page Transitions)

Source: [src/lib/animation/index.tsx](src/lib/animation/index.tsx) — exports [useWaveAnimation()](src/lib/animation/index.tsx:25), [PageWrapper()](src/lib/animation/index.tsx:110), [PageSection()](src/lib/animation/index.tsx:140), [PageTransition()](src/lib/animation/index.tsx:246).

This guide shows how to:

- Animate lists/sections as they appear in the viewport (wave/stagger in-view).
- Add page-level transitions for App Router route changes (fade/slide/scale/wipe).

Notes:

- All exports are client-only. Use inside "use client" components.
- Respects prefers-reduced-motion where applicable.

---

## 1) Wave/stagger-in animation

### Option A: use the hook directly

Example: animate a list of cards as they enter the viewport.

```tsx
"use client";

import { useWaveAnimation } from "@/lib/animation";
import { cn } from "@/lib/utils";

export function WaveListDemo() {
  const items = Array.from({ length: 6 }, (_, i) => i + 1);

  const { containerReference, getItemStyle, getItemClassName } = useWaveAnimation({
    threshold: 0.1, // IntersectionObserver threshold
    rootMargin: "50px", // When to start observing
    staggerDelay: 70, // ms between siblings
    duration: 500, // ms per item
  });

  return (
    <div ref={containerReference} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((n, index) => (
        <div
          key={n}
          style={getItemStyle(index)}
          className={getItemClassName(
            cn(
              "bg-card rounded-lg border p-6 shadow-sm",
              // Base classes are merged with the animation classes internally
            ),
          )}
        >
          <div className="text-muted-foreground text-sm">Card #{n}</div>
          <div className="mt-2 text-xl font-semibold">Hello</div>
        </div>
      ))}
    </div>
  );
}
```

### Option B: PageWrapper + PageSection

This removes the need to manually pass index and classes; each child section gets staggered styles and classes.

```tsx
"use client";

import { PageSection, PageWrapper } from "@/lib/animation";

export function SectionedContent() {
  return (
    <PageWrapper staggerDelay={80} duration={600} className="space-y-6">
      <PageSection index={0} className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Intro</h2>
        <p className="text-muted-foreground">First block fades/slides in.</p>
      </PageSection>

      <PageSection index={1} className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Details</h2>
        <p className="text-muted-foreground">Second block follows with delay.</p>
      </PageSection>

      <PageSection index={2} className="bg-card rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold">More</h2>
        <p className="text-muted-foreground">Third block, and so on…</p>
      </PageSection>
    </PageWrapper>
  );
}
```

### API summary

- Hook: [useWaveAnimation()](src/lib/animation/index.tsx:25)
  - Returns: { isVisible, containerReference, getItemStyle, getItemClassName }
  - Options: { threshold?: number; rootMargin?: string; staggerDelay?: number; duration?: number }
- Components: [PageWrapper()](src/lib/animation/index.tsx:110), [PageSection()](src/lib/animation/index.tsx:140)

---

## 2) Page transitions (App Router)

Wrap your app/layout.tsx children with [PageTransition()](src/lib/animation/index.tsx:246). On every pathname change, it animates a fresh entry.

### Basic layout integration

```tsx
// app/layout.tsx
"use client";

import { PageTransition } from "@/lib/animation";
import type { ReactNode } from "react";

import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PageTransition variant="fade" duration={500}>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
```

### Variants

Supported: "none" | "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "wipe".

```tsx
<PageTransition variant="slideUp" duration={600} />
<PageTransition variant="slideLeft" easing="cubic-bezier(0.22, 1, 0.36, 1)" />
<PageTransition variant="scale" />
<PageTransition variant="wipe" overlayColor="black" blur={4} />
```

### Wipe overlay

When variant="wipe", an overlay sweeps across the viewport while the content also fades in. Customize color and blur:

```tsx
<PageTransition
  variant="wipe"
  duration={700}
  easing="cubic-bezier(0.22, 1, 0.36, 1)"
  overlayColor="hsl(240 10% 3.9%)"
  blur={6}
/>
```

### Lifecycle callbacks

```tsx
<PageTransition onStart={() => console.log("enter start")} onEnd={() => console.log("enter end")}>
  {children}
</PageTransition>
```

### Reduced motion

If the user has prefers-reduced-motion, transitions minimize motion and fall back to a fast opacity change.

### Props reference

```ts
type PageTransitionVariant = "none" | "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "wipe";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number; // ms (default 600)
  easing?: string; // CSS timing function
  variant?: PageTransitionVariant;
  overlayColor?: string; // used when variant="wipe"
  disabled?: boolean;
  initial?: boolean; // animate on first mount (default true)
  blur?: number; // px blur on overlay (wipe)
  onStart?: () => void;
  onEnd?: () => void;
}
```

### Tips

- Place PageTransition as high as possible (e.g., directly around {children} in layout) to cover full-page.
- For nested transitions, you can wrap inner route segments with separate PageTransition instances.
- The transition only runs on pathname changes; query-only changes won’t retrigger by default.

## Troubleshooting

- Nothing animates: Ensure the components are in a "use client" file and that your elements are actually entering the viewport (for wave). For PageTransition, verify App Router usage and that usePathname() updates when navigating.
- Sudden jumps: Avoid layout thrash during enter (e.g., large async content shifting). Consider skeletons/placeholders so the container size is stable during the transition.
- Tailwind classes: getItemClassName merges your classes with animation classes. If you override transforms/opacities, ensure specificity doesn’t cancel the transition.

## License

MIT
