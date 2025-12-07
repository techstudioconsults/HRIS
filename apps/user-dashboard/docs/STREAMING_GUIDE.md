# Next.js Streaming with Suspense - Implementation Guide

## Overview
This project now implements Next.js streaming with Suspense boundaries for improved loading states and error handling.

## Components Created

### 1. Error Boundaries
- **`/src/app/error.tsx`** - Root level error boundary
- **`/src/app/[locale]/error.tsx`** - Locale level error boundary
- **`/src/components/shared/error/suspense-error.tsx`** - Reusable error component

### 2. Loading States
- **`/src/app/loading.tsx`** - Root level loading (already exists)
- **`/src/app/[locale]/loading.tsx`** - Locale level loading
- **`/src/components/shared/loading/suspense-loading.tsx`** - Reusable loading component
- **`/src/components/shared/loading/skeleton-loader.tsx`** - Skeleton UI components

## Usage Examples

### 1. Basic Suspense with Loading State

```tsx
import { Suspense } from "react";
import { SuspenseLoading } from "@/components/shared/loading";

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>
      <Suspense fallback={<SuspenseLoading text="Loading data..." size="md" />}>
        <AsyncComponent />
      </Suspense>
    </div>
  );
}

// Async component that fetches data
async function AsyncComponent() {
  const data = await fetchData();
  return <div>{/* render data */}</div>;
}
```

### 2. Multiple Suspense Boundaries

```tsx
import { Suspense } from "react";
import { SuspenseLoading, SkeletonLoader } from "@/components/shared/loading";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header loads independently */}
      <Suspense fallback={<SkeletonLoader variant="card" count={1} />}>
        <DashboardHeader />
      </Suspense>

      {/* Stats load independently */}
      <Suspense fallback={<SkeletonLoader variant="card" count={3} />}>
        <DashboardStats />
      </Suspense>

      {/* Table loads independently */}
      <Suspense fallback={<SkeletonLoader variant="table" count={5} />}>
        <DataTable />
      </Suspense>
    </div>
  );
}
```

### 3. Nested Suspense for Progressive Loading

```tsx
import { Suspense } from "react";
import { SuspenseLoading } from "@/components/shared/loading";

export default function UserProfilePage() {
  return (
    <div>
      {/* Profile loads first */}
      <Suspense fallback={<SuspenseLoading text="Loading profile..." />}>
        <UserProfile />
        
        {/* Posts load after profile */}
        <Suspense fallback={<SuspenseLoading text="Loading posts..." size="sm" />}>
          <UserPosts />
        </Suspense>
      </Suspense>
    </div>
  );
}
```

### 4. Error Boundary with Suspense

```tsx
"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "@/components/shared/error";
import { SuspenseLoading } from "@/components/shared/loading";

export default function Page() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SuspenseLoading />}>
        <DataComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 5. Using Different Skeleton Variants

```tsx
import { Suspense } from "react";
import { SkeletonLoader } from "@/components/shared/loading";

export default function Page() {
  return (
    <div className="space-y-8">
      {/* Card skeleton */}
      <Suspense fallback={<SkeletonLoader variant="card" count={3} />}>
        <CardGrid />
      </Suspense>

      {/* Table skeleton */}
      <Suspense fallback={<SkeletonLoader variant="table" count={10} />}>
        <DataTable />
      </Suspense>

      {/* List skeleton */}
      <Suspense fallback={<SkeletonLoader variant="list" count={5} />}>
        <ItemList />
      </Suspense>

      {/* Form skeleton */}
      <Suspense fallback={<SkeletonLoader variant="form" count={4} />}>
        <DynamicForm />
      </Suspense>
    </div>
  );
}
```

### 6. Streaming Data with Loading States

```tsx
import { Suspense } from "react";
import { SuspenseLoading } from "@/components/shared/loading";

export default function Page() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left panel - loads fast */}
      <Suspense fallback={<SuspenseLoading size="sm" />}>
        <FastComponent />
      </Suspense>

      {/* Right panel - loads slower */}
      <Suspense fallback={<SuspenseLoading text="Loading detailed data..." />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}

// These components can fetch data in parallel
async function FastComponent() {
  const data = await fetch("/api/fast");
  return <div>Fast data</div>;
}

async function SlowComponent() {
  const data = await fetch("/api/slow");
  return <div>Slow data</div>;
}
```

### 7. Custom Error Handler with Retry

```tsx
"use client";

import { Suspense, useState } from "react";
import { SuspenseError } from "@/components/shared/error";
import { SuspenseLoading } from "@/components/shared/loading";

export default function Page() {
  const [key, setKey] = useState(0);

  return (
    <Suspense 
      key={key} 
      fallback={<SuspenseLoading />}
    >
      <DataComponent 
        onError={() => (
          <SuspenseError 
            onRetry={() => setKey(prev => prev + 1)}
          />
        )}
      />
    </Suspense>
  );
}
```

## Best Practices

1. **Granular Suspense Boundaries**: Wrap individual sections that load at different speeds
2. **Meaningful Fallbacks**: Use specific loading messages for better UX
3. **Skeleton Matching**: Match skeleton UI to actual content layout
4. **Error Recovery**: Always provide retry functionality
5. **Progressive Enhancement**: Load critical content first, defer secondary content

## Automatic Route-Level Handling

The following files provide automatic error and loading states:
- `/app/error.tsx` - Catches errors at root level
- `/app/loading.tsx` - Shows when any route is loading
- `/app/[locale]/error.tsx` - Catches errors in locale routes
- `/app/[locale]/loading.tsx` - Shows when locale routes are loading

These work automatically without wrapping components in Suspense!

## API Routes with Streaming

For API routes that support streaming:

```tsx
// app/api/data/route.ts
export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send data in chunks
      controller.enqueue(encoder.encode('data: chunk1\n\n'));
      await delay(1000);
      controller.enqueue(encoder.encode('data: chunk2\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

## Testing Streaming

To test streaming behavior, add artificial delays:

```tsx
async function MyComponent() {
  // Simulate slow data fetching
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const data = await fetchData();
  return <div>{data}</div>;
}
```
