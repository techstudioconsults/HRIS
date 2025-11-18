# Animation Component Architecture Diagram

## Component Hierarchy

```
┌────────────────────────────────────────────────────────────────┐
│                      useWaveAnimation Hook                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ • Manages intersection observer                          │  │
│  │ • Calculates animation delays                           │  │
│  │ • Provides getItemStyle() & getItemClassName()          │  │
│  │ • Detects prefers-reduced-motion                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Uses
                              │
┌────────────────────────────────────────────────────────────────┐
│                    PageWrapper Component                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ <AnimationContext.Provider>                              │  │
│  │ • Creates animation context                             │  │
│  │ • Passes animation utilities to children                │  │
│  │ • Wraps content in container div with ref               │  │
│  │                                                          │  │
│  │ Props:                                                   │  │
│  │ • staggerDelay: 100 (ms between items)                   │  │
│  │ • duration: 600 (ms per animation)                       │  │
│  │ • threshold: 0.1                                         │  │
│  │ • rootMargin: "50px"                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│            ┌─────────────────┼─────────────────┐               │
│            │                 │                 │               │
│            ▼                 ▼                 ▼               │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│    │ PageSection  │  │ PageSection  │  │ PageSection  │     │
│    │  index: 0    │  │  index: 1    │  │  index: 2    │     │
│    └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
User visits login page
        │
        ▼
┌─────────────────────────────────┐
│ useWaveAnimation Hook executes  │
│ • Sets up IntersectionObserver  │
│ • Calculates initial state      │
│ • Returns:                      │
│   - isVisible: false            │
│   - getItemStyle()              │
│   - getItemClassName()          │
└─────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│ PageWrapper mounts              │
│ • Creates AnimationContext      │
│ • Attaches observer to ref      │
│ • Renders children              │
└─────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│ PageSection mounts (index 0)    │
│ • Reads context                 │
│ • Gets animation styles         │
│ • Renders with:                 │
│   - opacity: 0                  │
│   - transform: translateY(8px)  │
│   - scale: 0.95                 │
└─────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│ Element enters viewport         │
│ IntersectionObserver triggers   │
│ setIsVisible(true)              │
└─────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│ requestAnimationFrame fires     │
│ CSS Transition applies:         │
│ • From: opacity 0, scale 0.95   │
│ • To: opacity 1, scale 1        │
│ • Duration: 600ms               │
│ • With easing curve             │
└─────────────────────────────────┘
        │
        ├──► 0ms: Section 0 animates
        │
        ├──► 100ms: Section 1 animates
        │
        ├──► 200ms: Section 2 animates
        │
        └──► ... continues for all sections
```

---

## State Machine

```
┌─────────────┐
│   INITIAL   │
│ All items   │
│ opacity: 0  │
└──────┬──────┘
       │ User scrolls / Page loads
       │
       ▼
┌─────────────────────┐
│  ANIMATING          │
│ Items gradually:    │
│ • Increase opacity  │
│ • Slide up          │
│ • Scale to 100%     │
└──────┬──────────────┘
       │ Duration: 600ms × number of items
       │
       ▼
┌─────────────┐
│   COMPLETE  │
│ All items   │
│ opacity: 1  │
└─────────────┘
```

---

## CSS Transition Application

```
Initial State (t=0ms)
┌────────────────────────────────┐
│ Style Applied by getItemStyle  │
├────────────────────────────────┤
│ opacity: 0                     │
│ transform: translateY(8px)     │
│ transform: scale(0.95)         │
│ transition: ...                │
│ willChange: transform, opacity │
└────────────────────────────────┘
        │
        │ requestAnimationFrame
        │
        ▼
Animated State (t=0-600ms)
┌────────────────────────────────┐
│ CSS Engine calculates values   │
├────────────────────────────────┤
│ opacity: 0 ──→ 1              │
│ transform: translateY(8px)     │
│            ──→ translateY(0)   │
│ transform: scale(0.95)         │
│            ──→ scale(1)        │
│ Timing: cubic-bezier()         │
└────────────────────────────────┘
        │
        │ 600ms elapsed
        │
        ▼
Final State (t≥600ms)
┌────────────────────────────────┐
│ Animation Complete             │
├────────────────────────────────┤
│ opacity: 1                     │
│ transform: translateY(0)       │
│ transform: scale(1)            │
│ willChange: auto               │
└────────────────────────────────┘
```

---

## PageTransition (Alternative)

```
┌───────────────────────────────────┐
│      PageTransition Component      │
│  (For full-page route changes)    │
├───────────────────────────────────┤
│ Detects route change:             │
│ pathname changed                  │
│         │                         │
│         ▼                         │
│ Select animation variant:         │
│ • fade                           │
│ • slideUp / slideDown            │
│ • slideLeft / slideRight          │
│ • scale                           │
│ • wipe (with overlay)             │
│ • none                            │
│         │                         │
│         ▼                         │
│ Apply initial styles              │
│ (variant-dependent)               │
│         │                         │
│         ▼                         │
│ requestAnimationFrame             │
│ Transition to final state         │
│         │                         │
│         ▼                         │
│ Animation complete                │
│ User sees new page                │
└───────────────────────────────────┘
```

---

## Login Page Implementation

```
<PageWrapper>  ← Context Provider
  │
  ├─ <PageSection index={0}>
  │  └─ <div className="mb-8 space-y-2">
  │     ├─ <h3>Welcome Back, HR</h3>
  │     └─ <p>Login to access...</p>
  │
  ├─ <PageSection index={1}>
  │  └─ <form>
  │     ├─ <FormField name="email" />
  │     └─ <FormField name="password" />
  │
  ├─ <PageSection index={2}>
  │  └─ <div className="relative my-6">
  │     └─ OR Divider
  │
  ├─ <PageSection index={3}>
  │  └─ <MainButton>Log in with OTP instead</MainButton>
  │
  └─ <PageSection index={4}>
     └─ <p>Don't have an account? <Link>Sign Up</Link></p>

Animation Sequence:
┌──────┬──────┬──────┬──────┬──────┐
│ 0ms  │ 100ms│ 200ms│ 300ms│ 400ms│
├──────┼──────┼──────┼──────┼──────┤
│  S0  │  S1  │  S2  │  S3  │  S4  │
│ Anim │ Anim │ Anim │ Anim │ Anim │
└──────┴──────┴──────┴──────┴──────┘
Each animation: 600ms duration
Total time to complete: ~1000ms
```

---

## Performance: Transform Chain

```
CPU Task (Minimal)
┌──────────────────────────────┐
│ JavaScript (useWaveAnimation)│
│ • Detect intersection        │
│ • Update state              │
│ • Render component          │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│ Browser's Rendering Engine  │
│ • Parse CSS transition      │
│ • Calculate animation curve │
│ • Hand to GPU               │
└──────────────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│ GPU Rendering (60fps)        │
│ • Transform opacity          │
│ • Transform translateY       │
│ • Transform scale            │
│ • Composite layers           │
└──────────────────────────────┘

Result: Smooth 60fps animation, minimal CPU usage
```

---

## Hook Dependencies Flow

```
useWaveAnimation Hook
├─ useState (isVisible)
├─ useRef (containerReference)
├─ useEffect (IntersectionObserver setup)
├─ useMemo (getItemStyle)
├─ useMemo (getItemClassName)
└─ cn() utility function (from @/lib/utils)
     │
     └─ Combines Tailwind classes

PageWrapper
├─ useWaveAnimation Hook (returns data)
├─ createContext (AnimationContext)
└─ Provides context to children

PageSection
├─ useContext (AnimationContext)
├─ Reads getItemStyle & getItemClassName
└─ Applies animations
```

---

## Configuration Space

```
Animation Characteristics
┌─────────────────────────────────────┐
│ staggerDelay: 50-500ms             │
│ • 50ms: Rapid cascading effect      │
│ • 100ms: Moderate cascading (recommended)│
│ • 300ms: Slow cascading effect      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ duration: 300-1000ms                │
│ • 300ms: Quick animations           │
│ • 600ms: Balanced (recommended)     │
│ • 1000ms: Dramatic slow entrance    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ threshold: 0.05-0.5                 │
│ • 0.05: Trigger very early          │
│ • 0.1: Trigger standard (recommended)│
│ • 0.5: Trigger when half visible    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ rootMargin: "0px" to "500px"        │
│ • 0px: Trigger at viewport edge     │
│ • 50px: Trigger 50px before visible │
│ • 200px: Trigger well in advance    │
└─────────────────────────────────────┘
```

