# HRIS Monorepo

A monorepo containing all HRIS applications built with Next.js, TurboRepo, and pnpm workspaces.

## 📁 Project Structure

```
hris-mono-repo/
├── apps/
│   ├── web/                    # Marketing/Landing pages (Port 3002)
│   ├── user-dashboard/         # Main HRIS User Dashboard (Port 3000)
│   └── controller-dashboard/   # Controller Dashboard (Port 3001)
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── eslint-config/          # Shared ESLint configurations
│   └── typescript-config/      # Shared TypeScript configurations
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 10.4.1 or higher

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

Run all apps concurrently:

```bash
pnpm dev
```

Run specific apps:

```bash
# User Dashboard (Port 3000)
pnpm dev:user

# Controller Dashboard (Port 3001)
pnpm dev:controller

# Web/Marketing (Port 3002)
pnpm dev:web
```

### Building

Build all apps:

```bash
pnpm build
```

Build specific apps:

```bash
pnpm build:user
pnpm build:controller
pnpm build:web
```

### Other Commands

```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Format code
pnpm format
```

## 📦 Apps

### User Dashboard (`apps/user-dashboard`)

The main HRIS application for end users. Migrated from the original HRIS standalone app.

- **Port:** 3000
- **Features:** Employee management, payroll, teams, resources, onboarding

### Controller Dashboard (`apps/controller-dashboard`)

Dashboard for controllers to manage and oversee HRIS operations.

- **Port:** 3001
- **Status:** Initial setup

### Web (`apps/web`)

Marketing and landing pages.

- **Port:** 3002
- **Status:** Initial setup

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Build Tool:** TurboRepo
- **Package Manager:** pnpm
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI, shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod

## 📝 Adding Components (shadcn/ui)

To add components to your app, run the following command at the root of your app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## 🎨 Using Shared UI Components

Import components from the `ui` package:

```tsx
import { Button } from '@workspace/ui/components/button';
```

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## 📄 Migration Notes

The user-dashboard app has been migrated from the standalone HRIS project with the following changes:

- Updated package name from `tsa-hri-system` to `user-dashboard`
- Added workspace dependencies for shared packages
- Configured to run on port 3000
- All original functionality preserved
