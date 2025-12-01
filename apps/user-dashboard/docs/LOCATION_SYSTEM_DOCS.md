## Country → State → City Dynamic Selection System

This document outlines the implementation of a dynamic country-state-city selection system for the Company Profile form.

### Architecture Overview

The system uses two external APIs with a Next.js backend abstraction layer:

1. **REST Countries API** (`https://restcountries.com/v3.1`) - For country data
2. **Countries Now API** (`https://countriesnow.space/api/v0.1`) - For states and cities data

### Components

#### 1. Backend API Endpoints (`src/app/api/location/route.ts`)

A single GET endpoint that abstracts the external APIs with the following query parameters:

**Endpoint:** `GET /api/location`

**Query Parameters:**
- `type` (required): One of `countries`, `states`, or `cities`
- `country` (required for `states` and `cities`): Country name
- `state` (optional for `cities`): State name for filtered results

**Request Examples:**

```bash
# Get all countries
GET /api/location?type=countries

# Get states for a country
GET /api/location?type=states&country=Nigeria

# Get all cities in a country
GET /api/location?type=cities&country=Nigeria

# Get cities in a specific state
GET /api/location?type=cities&country=Nigeria&state=Lagos
```

**Response Format:**

```json
{
  "success": true,
  "data": [
    {
      "value": "lagos",
      "label": "Lagos"
    },
    {
      "value": "abuja",
      "label": "Abuja"
    }
  ],
  "count": 37,
  "country": "Nigeria",
  "state": "Lagos"
}
```

**Features:**
- Caching strategy using Next.js `revalidate` (24 hours)
- Automatic case normalization for searches
- Fallback mechanism when state-specific cities fail
- Alphabetical sorting of results
- Full TypeScript type support
- Comprehensive error handling

#### 2. React Hooks (`src/hooks/use-location.ts`)

Four custom hooks for managing location data:

##### `useCountries()`
Fetches and returns all countries on component mount.

```typescript
const { countries, isLoading, error } = useCountries();
```

**Returns:**
- `countries`: Array of country options
- `isLoading`: Boolean loading state
- `error`: String error message or null

##### `useStates(country: string | null)`
Fetches states for a given country, updates when country changes.

```typescript
const { states, isLoading, error } = useStates(selectedCountry);
```

**Returns:**
- `states`: Array of state options (empty if no country selected)
- `isLoading`: Boolean loading state
- `error`: String error message or null

##### `useCities(country: string | null, state?: string | null)`
Fetches cities for a given country and optional state.

```typescript
const { cities, isLoading, error } = useCities(selectedCountry, selectedState);
```

**Returns:**
- `cities`: Array of city options
- `isLoading`: Boolean loading state
- `error`: String error message or null

##### `useLocationData()`
Composite hook that manages all location fields together.

```typescript
const {
  countries,
  states,
  cities,
  selectedCountry,
  selectedState,
  isLoading,
  countriesLoading,
  statesLoading,
  citiesLoading,
  error,
  countriesError,
  statesError,
  citiesError,
  handleCountryChange,
  handleStateChange,
} = useLocationData();
```

### Updated Components

#### Company Profile Form (`src/modules/@org/onboarding/_components/forms/company-profile.tsx`)

**Changes:**
1. Removed static imports of `cityOptions`, `countries`, `stateOptions` from constants
2. Added `useLocationData` hook import
3. Integrated location hook into form with dynamic field population
4. Synchronized form state with hook using `watch()` and `useEffect`
5. Added conditional disabling based on loading states
6. Updated placeholders to show loading status
7. All three location fields now use `Controller` with `ComboBox` for consistent behavior

**Form Flow:**
1. User selects country
2. States dropdown automatically populates with that country's states
3. States dropdown becomes enabled
4. User selects state
5. Cities dropdown automatically populates with cities from that state
6. Cities dropdown becomes enabled
7. User selects city

### Usage Example

```typescript
import { useLocationData } from "@/hooks/use-location";

function MyForm() {
  const {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    handleCountryChange,
    handleStateChange,
    countriesLoading,
    statesLoading,
  } = useLocationData();

  return (
    <>
      <select
        value={selectedCountry || ""}
        onChange={(e) => handleCountryChange(e.target.value || null)}
        disabled={countriesLoading}
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={selectedState || ""}
        onChange={(e) => handleStateChange(e.target.value || null)}
        disabled={statesLoading || !selectedCountry}
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select disabled={!selectedCountry}>
        <option value="">Select City</option>
        {cities.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </>
  );
}
```

### API Endpoints Summary

| Endpoint | Method | Purpose | Query Params |
|----------|--------|---------|--------------|
| `/api/location?type=countries` | GET | Get all countries | type: "countries" |
| `/api/location?type=states` | GET | Get states by country | type, country |
| `/api/location?type=cities` | GET | Get cities by country | type, country |
| `/api/location?type=cities` | GET | Get cities by state | type, country, state |

### Error Handling

The system implements graceful error handling:

1. **API Errors:** Failed requests return HTTP error status with error message
2. **State Errors:** If state-specific cities fail, falls back to country-wide cities
3. **No Data:** Returns empty array with success flag if location not found
4. **Loading States:** UI reflects loading status during API calls

### Performance Optimizations

1. **Next.js ISR Caching:** Results cached for 24 hours using `revalidate`
2. **React Hook Caching:** Prevents unnecessary re-fetches with dependency arrays
3. **Form Integration:** Syncs form state with hook state efficiently
4. **Lazy Loading:** API calls only made when needed (country/state selected)

### Testing the Implementation

```bash
# Test getting countries
curl "http://localhost:3000/api/location?type=countries" | jq '.data | length'

# Test getting Nigerian states
curl "http://localhost:3000/api/location?type=states&country=Nigeria" | jq '.data'

# Test getting Lagos cities
curl "http://localhost:3000/api/location?type=cities&country=Nigeria&state=Lagos" | jq '.data'
```

### Migration Notes

The implementation maintains backward compatibility:
- Static fallback constants still exist but are not used in the updated form
- Other forms can continue using static constants or migrate to the new hooks
- The API endpoint is ready for use in any component throughout the application

### Future Enhancements

1. Add caching at the client level using React Query or SWR
2. Implement debouncing for rapid selection changes
3. Add city search/filter functionality
4. Support for multi-select cities
5. Offline fallback with cached data
6. Rate limiting for external API calls
