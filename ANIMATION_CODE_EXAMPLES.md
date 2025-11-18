# Animation Component - Code Examples & Reference

## Complete Login Page Example (Implemented ✅)

```tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MainButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { PageSection, PageWrapper } from "@/lib/animation";
import { LoginFormData, loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export const Login = () => {
  const router = useRouter();
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    setError,
  } = methods;

  const handleSubmitForm = async (data: LoginFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        toast.success("Login Successful", {
          description: "Redirecting to dashboard...",
        });
        router.push("/onboarding");
      }
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error.message || "An error occurred during login",
      });
      setError("password", { message: error.message || "Invalid OTP" });
    }
  };

  return (
    <PageWrapper staggerDelay={100} duration={600} className="mx-auto max-w-[527px]">
      {/* Section 0: Header - Animates at 0ms */}
      <PageSection index={0} className="mb-8 space-y-2">
        <h3 className="text-[32px]/[120%] font-[600] tracking-[-2%]">Welcome Back, HR</h3>
        <p className={`text-lg text-gray-200`}>Login to access your HR dashboard, and simplify operations.</p>
      </PageSection>

      <FormProvider {...methods}>
        {/* Section 1: Login Form - Animates at 100ms */}
        <PageSection index={1}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="">
            <section className={`space-y-4`}>
              <FormField
                placeholder={`Enter email address`}
                className={`h-14 w-full`}
                label={`Email Address`}
                name={"email"}
                required
              />
              <div className="space-y-2">
                <FormField
                  type={`password`}
                  placeholder={`Enter password`}
                  className={`h-14 w-full`}
                  label={`Password`}
                  name={"password"}
                  required
                />
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-primary text-sm font-medium hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </section>
            <div className="pt-8">
              <MainButton
                type="submit"
                variant="primary"
                isDisabled={isSubmitting || !isValid}
                isLoading={isSubmitting}
                className="w-full"
                size="2xl"
              >
                Log In
              </MainButton>
            </div>
          </form>
        </PageSection>

        {/* Section 2: Divider - Animates at 200ms */}
        <PageSection index={2} className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="text-muted-foreground bg-background px-2">OR</span>
          </div>
        </PageSection>

        {/* Section 3: OTP Button - Animates at 300ms */}
        <PageSection index={3}>
          <MainButton href={`/login/otp`} variant="primaryOutline" className="w-full" size={`2xl`}>
            Log in with OTP instead
          </MainButton>
        </PageSection>

        {/* Section 4: Sign Up Link - Animates at 400ms */}
        <PageSection index={4}>
          <p className="text-grey-500 mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </PageSection>
      </FormProvider>
    </PageWrapper>
  );
};
```

---

## Example 1: Simple List Animation

```tsx
import { PageWrapper, PageSection } from "@/lib/animation";

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserList({ users }: { users: User[] }) {
  return (
    <PageWrapper staggerDelay={80} duration={500}>
      <PageSection index={0} className="mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
      </PageSection>

      {users.map((user, index) => (
        <PageSection key={user.id} index={index + 1} className="p-4 border rounded mb-2">
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </PageSection>
      ))}
    </PageWrapper>
  );
}
```

---

## Example 2: Product Card Grid

```tsx
import { PageWrapper, PageSection } from "@/lib/animation";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <PageWrapper staggerDelay={60} duration={500} className="grid grid-cols-3 gap-6">
      {products.map((product, index) => (
        <PageSection key={product.id} index={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-lg font-bold text-primary">${product.price}</p>
          </div>
        </PageSection>
      ))}
    </PageWrapper>
  );
}
```

---

## Example 3: Full Page Transition

```tsx
// src/app/[locale]/layout.tsx
"use client";

import { PageTransition } from "@/lib/animation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <PageTransition variant="wipe" duration={700} overlayColor="var(--background)">
          <main>{children}</main>
        </PageTransition>
      </body>
    </html>
  );
}
```

---

## Example 4: Variant Showcase

```tsx
import { PageTransition } from "@/lib/animation";

export function AnimationShowcase() {
  const variants = ["fade", "slideUp", "slideDown", "slideLeft", "slideRight", "scale", "wipe"];

  return (
    <div className="space-y-8">
      {variants.map((variant) => (
        <PageTransition
          key={variant}
          variant={variant as any}
          duration={600}
          overlayColor="rgba(0, 0, 0, 0.1)"
        >
          <div className="p-8 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-bold">Variant: {variant}</h3>
            <p>Try navigating between pages to see this animation</p>
          </div>
        </PageTransition>
      ))}
    </div>
  );
}
```

---

## Example 5: Responsive Animation

```tsx
import { PageWrapper, PageSection } from "@/lib/animation";
import { useMediaQuery } from "@/hooks/use-media-query";

export function ResponsiveAnimation() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Adjust animation timing for mobile devices
  const staggerDelay = isMobile ? 50 : 100;
  const duration = isMobile ? 400 : 600;

  return (
    <PageWrapper staggerDelay={staggerDelay} duration={duration}>
      <PageSection index={0}>
        <h1 className="text-4xl font-bold">Responsive Animations</h1>
      </PageSection>
      <PageSection index={1}>
        <p>Animations adjust based on device size</p>
      </PageSection>
      <PageSection index={2}>
        <p>Mobile: {isMobile ? "Yes" : "No"}</p>
      </PageSection>
    </PageWrapper>
  );
}
```

---

## Example 6: Conditional Animation

```tsx
import { PageWrapper, PageSection } from "@/lib/animation";

export function ConditionalAnimation({ isLoading }: { isLoading: boolean }) {
  // Disable animations while loading
  return (
    <PageWrapper staggerDelay={100} duration={600}>
      <PageSection index={0}>
        <h1>Content</h1>
      </PageSection>

      {!isLoading && (
        <>
          <PageSection index={1}>
            <div>Item 1 (only animates after loading)</div>
          </PageSection>
          <PageSection index={2}>
            <div>Item 2 (only animates after loading)</div>
          </PageSection>
        </>
      )}
    </PageWrapper>
  );
}
```

---

## Example 7: Advanced Stagger Pattern

```tsx
import { PageWrapper, PageSection } from "@/lib/animation";

export function AdvancedStagger() {
  const sections = [
    { title: "Section 1", items: [1, 2, 3] },
    { title: "Section 2", items: [4, 5, 6] },
    { title: "Section 3", items: [7, 8, 9] },
  ];

  let sectionIndex = 0;

  return (
    <PageWrapper staggerDelay={100} duration={600}>
      {sections.map((section) => (
        <div key={section.title}>
          <PageSection index={sectionIndex++} className="text-2xl font-bold mb-4">
            {section.title}
          </PageSection>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {section.items.map((item) => (
              <PageSection key={item} index={sectionIndex++} className="p-4 bg-gray-100 rounded">
                Item {item}
              </PageSection>
            ))}
          </div>
        </div>
      ))}
    </PageWrapper>
  );
}
```

---

## Example 8: Hook Usage Directly

```tsx
import { useWaveAnimation } from "@/lib/animation";

export function DirectHookUsage() {
  const {
    isVisible,
    containerReference,
    getItemStyle,
    getItemClassName,
  } = useWaveAnimation({
    staggerDelay: 100,
    duration: 600,
    threshold: 0.1,
    rootMargin: "50px",
  });

  const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

  return (
    <div ref={containerReference} className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item}
          style={getItemStyle(index)}
          className={getItemClassName("p-4 bg-blue-500 text-white rounded")}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
```

---

## Example 9: Custom Animation Easing

```tsx
import { PageTransition } from "@/lib/animation";

export function CustomEasing() {
  const easingFunctions = {
    linear: "linear",
    easeIn: "cubic-bezier(0.42, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.58, 1)",
    easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
    sharp: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Default
    smooth: "cubic-bezier(0.43, 0.13, 0.23, 0.96)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  };

  return (
    <PageTransition
      variant="slideUp"
      duration={800}
      easing={easingFunctions.bounce}
    >
      <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-500">
        <h1 className="text-4xl font-bold text-white">Bouncy Animation</h1>
      </div>
    </PageTransition>
  );
}
```

---

## Example 10: Dashboard with Animations

```tsx
import { PageWrapper, PageSection } from "@/lib/animation";

export function Dashboard() {
  return (
    <PageWrapper staggerDelay={80} duration={500}>
      <PageSection index={0} className="mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back!</p>
      </PageSection>

      <div className="grid grid-cols-2 gap-6">
        <PageSection index={1} className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Revenue</h2>
          <p className="text-3xl font-bold text-green-500">$45,231</p>
        </PageSection>

        <PageSection index={2} className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-3xl font-bold text-blue-500">1,234</p>
        </PageSection>

        <PageSection index={3} className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-3xl font-bold text-orange-500">567</p>
        </PageSection>

        <PageSection index={4} className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Growth</h2>
          <p className="text-3xl font-bold text-purple-500">+23%</p>
        </PageSection>
      </div>

      <PageSection index={5} className="mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          <p>• User registered: John Doe</p>
          <p>• Order placed: #12345</p>
          <p>• Payment received: $1,200</p>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
```

---

## Configuration Presets

```tsx
// Animation presets for common scenarios

export const ANIMATION_PRESETS = {
  // Quick, snappy animations
  fast: {
    staggerDelay: 30,
    duration: 300,
    threshold: 0.1,
    rootMargin: "50px",
  },

  // Default, balanced
  default: {
    staggerDelay: 100,
    duration: 600,
    threshold: 0.1,
    rootMargin: "50px",
  },

  // Slow, dramatic
  slow: {
    staggerDelay: 200,
    duration: 1000,
    threshold: 0.1,
    rootMargin: "50px",
  },

  // Mobile optimized (shorter animations)
  mobile: {
    staggerDelay: 50,
    duration: 400,
    threshold: 0.15,
    rootMargin: "25px",
  },

  // Subtle, minimal
  subtle: {
    staggerDelay: 20,
    duration: 250,
    threshold: 0.2,
    rootMargin: "0px",
  },

  // Dramatic, eye-catching
  dramatic: {
    staggerDelay: 250,
    duration: 1200,
    threshold: 0.05,
    rootMargin: "100px",
  },
};

// Usage:
// <PageWrapper {...ANIMATION_PRESETS.fast}>

// Or custom:
// <PageWrapper {...ANIMATION_PRESETS.default} staggerDelay={150}>
```

---

## TypeScript Type Definitions

```tsx
import type { ReactNode, CSSProperties, FC } from "react";

interface UseWaveAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  staggerDelay?: number;
  duration?: number;
}

interface UseWaveAnimationReturn {
  isVisible: boolean;
  containerReference: React.RefObject<HTMLDivElement>;
  getItemStyle: (index: number) => CSSProperties;
  getItemClassName: (baseClasses?: string) => string;
}

interface PageWrapperProperties extends UseWaveAnimationOptions {
  children: ReactNode;
  className?: string;
}

interface PageSectionProperties {
  children: ReactNode;
  index: number;
  className?: string;
}

interface PageTransitionProperties {
  children: ReactNode;
  className?: string;
  duration?: number;
  easing?: string;
  variant?: PageTransitionVariant;
  overlayColor?: string;
  disabled?: boolean;
  initial?: boolean;
  blur?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

type PageTransitionVariant = "none" | "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "wipe";
```

