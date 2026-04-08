'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-4">
      <section className="mx-auto w-full max-w-lg rounded-2xl border border-neutral-200 p-8 text-center">
        <h1 className="text-primary text-2xl font-semibold">You are offline</h1>
        <p className="mt-3 text-sm text-neutral-600">
          We could not reach the network. Reconnect and retry to continue using
          your HR dashboard.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium"
          >
            Go home
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </section>
    </main>
  );
}
