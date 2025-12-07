# Quick Start Guide - HRIS Monorepo

## Prerequisites
- Node.js 20+
- pnpm 10.4.1+

## Installation

```bash
cd /home/kingsley/Documents/projects/hris-mono-repo
pnpm install
```

## Running the Applications

### Option 1: Run All Apps Simultaneously
```bash
pnpm dev
```
This will start:
- User Dashboard on http://localhost:3000
- Controller Dashboard on http://localhost:3001
- Web App on http://localhost:3002

### Option 2: Run Individual Apps

**User Dashboard (Main HRIS App)**
```bash
pnpm dev:user
# Runs on http://localhost:3000
```

**Controller Dashboard**
```bash
pnpm dev:controller
# Runs on http://localhost:3001
```

**Web/Marketing App**
```bash
pnpm dev:web
# Runs on http://localhost:3002
```

## Building for Production

```bash
# Build all apps
pnpm build

# Build specific apps
pnpm build:user
pnpm build:controller
pnpm build:web
```

## Other Useful Commands

```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Format code
pnpm format
```

## Application Details

### User Dashboard (`apps/user-dashboard`)
**Port:** 3000  
**Description:** Main HRIS application with full employee management, payroll, teams, and resources functionality.

**Key Features:**
- Employee Management
- Payroll Processing
- Team Management
- Resources Management
- Onboarding System
- Real-time Notifications

**Environment Files:**
- `.env` - Template environment variables
- `.env.local` - Local environment variables (gitignored)

### Controller Dashboard (`apps/controller-dashboard`)
**Port:** 3001  
**Description:** Dashboard for HRIS controllers and administrators.

**Status:** Initial setup complete, ready for feature development.

### Web (`apps/web`)
**Port:** 3002  
**Description:** Marketing and landing pages.

## Workspace Structure

```
hris-mono-repo/
├── apps/
│   ├── controller-dashboard/    # Port 3001
│   ├── user-dashboard/          # Port 3000 (main HRIS app)
│   └── web/                     # Port 3002
└── packages/
    ├── eslint-config/           # Shared ESLint configs
    ├── typescript-config/       # Shared TS configs
    └── ui/                      # Shared UI components
```

## Development Tips

1. **Running Specific App:** When developing a specific feature, run only that app:
   ```bash
   pnpm dev:user  # Focus on user dashboard
   ```

2. **Watching for Changes:** TurboRepo will automatically watch for changes in dependencies and rebuild as needed.

3. **Sharing Components:** Place reusable components in `packages/ui` for use across all apps.

4. **Environment Variables:** Each app can have its own `.env.local` file in its directory.

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```bash
# Find and kill the process using the port
lsof -ti:3000 | xargs kill -9  # For user-dashboard
lsof -ti:3001 | xargs kill -9  # For controller-dashboard
lsof -ti:3002 | xargs kill -9  # For web
```

### Build Errors
Clear the cache and rebuild:
```bash
rm -rf node_modules/.cache
pnpm build
```

### Dependency Issues
Reinstall dependencies:
```bash
rm -rf node_modules
pnpm install
```

## Next Steps

1. Start the user-dashboard and explore existing features
2. Plan controller-dashboard features
3. Move common components to shared packages
4. Set up CI/CD pipeline
5. Configure deployment

## Need Help?

- Check the main README.md for detailed documentation
- Review MIGRATION_SUMMARY.md for migration details
- Consult individual app READMEs in their directories
