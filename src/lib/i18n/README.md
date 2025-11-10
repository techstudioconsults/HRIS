# Internationalization (i18n) Navigation Helpers

This directory contains the internationalization configuration and navigation helpers for next-intl v3.9.1.

## Navigation Helpers

The navigation helpers are located in `navigation.ts` and provide localized navigation functionality that works with the locale routing setup.

### Available Exports

```typescript
import {
  getLocaleFromPath,
  getLocalizedPath,
  getPathWithoutLocale,
  Link,
  redirect,
  usePathname,
  useRouter,
} from "@/lib/i18n/navigation";
```

### Core Navigation Hooks

These are the localized versions of Next.js navigation hooks that automatically handle locale routing:

- **`Link`**: Localized version of Next.js Link component
- **`redirect`**: Localized version of Next.js redirect function
- **`usePathname`**: Localized version of Next.js usePathname hook
- **`useRouter`**: Localized version of Next.js useRouter hook

### Utility Functions

- **`getLocalizedPath(path, locale?)`**: Converts a path to include the locale prefix
- **`getPathWithoutLocale(pathname)`**: Removes the locale prefix from a pathname
- **`getLocaleFromPath(pathname)`**: Extracts the locale from a pathname

## Usage Examples

### Basic Navigation

```tsx
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      {/* Localized Link */}
      <Link href="/about">About Us</Link>

      {/* Programmatic navigation */}
      <button onClick={() => router.push("/contact")}>Contact Us</button>
    </div>
  );
}
```

### Working with Paths

```tsx
import { getLocaleFromPath, getLocalizedPath, getPathWithoutLocale } from "@/lib/i18n/navigation";

// Get localized path
const localizedPath = getLocalizedPath("/about", "fr"); // "/fr/about"

// Get path without locale
const pathWithoutLocale = getPathWithoutLocale("/fr/about"); // "/about"

// Get locale from path
const locale = getLocaleFromPath("/fr/about"); // "fr"
```

## Migration from Standard Next.js Hooks

To migrate from standard Next.js navigation hooks to the localized versions:

### Before (Standard Next.js)

```tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
```

### After (Localized)

```tsx
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
```

## Configuration

The navigation helpers are configured in `config.ts` with the following settings:

- **Locales**: `["en", "fr", "es", "ar"]`
- **Default Locale**: `"en"`
- **Locale Prefix**: `"always"` (always include locale in URL)

## Middleware Integration

The navigation helpers work with the middleware configuration in `src/middleware.ts` which handles:

- Locale detection and routing
- Authentication and authorization
- Route protection based on user roles

## Supported Locales

- 🇺🇸 English (`en`)
- 🇫🇷 Français (`fr`)
- 🇪🇸 Español (`es`)
- ��🇦 العربية (`ar`)
