# Quick Reference Guide - Location System

## For Developers

### Using in a Component

```typescript
import { useLocationData } from "@/hooks/use-location";

function MyComponent() {
  const {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    countriesLoading,
    statesLoading,
    citiesLoading,
    handleCountryChange,
    handleStateChange,
  } = useLocationData();

  return (
    // Your JSX here
  );
}
```

### API Endpoints

| Use Case | Endpoint | Parameters |
|----------|----------|------------|
| Get all countries | `/api/location?type=countries` | `type=countries` |
| Get states | `/api/location?type=states&country=Nigeria` | `type=states&country=` |
| Get cities | `/api/location?type=cities&country=Nigeria` | `type=cities&country=` |
| Get cities by state | `/api/location?type=cities&country=Nigeria&state=Lagos` | `type=cities&country=&state=` |

### Hook Returns

```typescript
{
  // Data
  countries: LocationOption[];      // All countries
  states: LocationOption[];          // States of selected country
  cities: LocationOption[];          // Cities of selected country/state
  selectedCountry: string | null;    // Currently selected country value
  selectedState: string | null;      // Currently selected state value

  // Loading states
  isLoading: boolean;                // Any data loading
  countriesLoading: boolean;         // Countries loading
  statesLoading: boolean;            // States loading
  citiesLoading: boolean;            // Cities loading

  // Errors
  error: string | null;              // Any error message
  countriesError: string | null;     // Countries error
  statesError: string | null;        // States error
  citiesError: string | null;        // Cities error

  // Handlers
  handleCountryChange: (country: string | null) => void;  // Set country
  handleStateChange: (state: string | null) => void;      // Set state
}
```

### LocationOption Format

```typescript
interface LocationOption {
  value: string;    // lowercase, for form value
  label: string;    // display text (with flag emoji for countries)
}
```

## Implementation Details

### API Response

```json
{
  "success": true,
  "data": [
    { "value": "lagos", "label": "Lagos" },
    { "value": "abuja", "label": "Abuja" }
  ],
  "count": 2,
  "message": "optional error/info message",
  "country": "Nigeria",
  "state": "Lagos"
}
```

### Caching

- **Backend**: 24-hour ISR cache on `/api/location`
- **Client**: Each hook manages its own state and prevents re-fetches
- **Strategy**: API calls only happen when country/state changes

## Usage Patterns

### Pattern 1: Composite Hook (Recommended)
```typescript
const { countries, states, cities, handleCountryChange, handleStateChange } = useLocationData();
// Use all three together
```

### Pattern 2: Individual Hooks
```typescript
const { countries } = useCountries();
const { states } = useStates(country);
const { cities } = useCities(country, state);
// Fine-grained control
```

### Pattern 3: Direct API Fetch
```typescript
const data = await fetch("/api/location?type=states&country=Nigeria");
const states = (await data.json()).data;
// Simple one-off requests
```

## Disabled State Rules

```
Country field:  Disabled while loading countries
State field:    Disabled while loading states OR country not selected
City field:     Disabled while loading cities OR country not selected
```

## Common Scenarios

### Scenario 1: Form Submission
Form values automatically reflect the selected country/state/city from dropdowns.

### Scenario 2: Pre-filled Values
Set form initial values using React Hook Form's `defaultValues`:
```typescript
const methods = useForm({
  defaultValues: {
    country: "nigeria",
    state: "lagos",
    city: "lagos"
  }
});
```

### Scenario 3: Clear Selection
To reset location selection:
```typescript
handleCountryChange(null);
handleStateChange(null);
// This clears states and cities automatically
```

### Scenario 4: Display Current Selection
```typescript
if (selectedCountry) {
  console.log(`Selected: ${selectedCountry}`);
}
```

## Troubleshooting

### States not showing up
- ✓ Check that country is selected
- ✓ Check browser console for API errors
- ✓ Verify country name matches API (case-sensitive in some cases)

### Cities not showing up
- ✓ Check that country is selected
- ✓ Check that state is selected (if available)
- ✓ Verify API response has data

### Slow loading
- ✓ Check network tab for API response time
- ✓ Ensure you're using the composite hook (it's optimized)
- ✓ Consider adding React Query for better caching

### Form not saving location
- ✓ Verify form includes country, state, city fields
- ✓ Check that fields are properly connected to form state
- ✓ Verify schema validation includes location fields

## File Locations

```
src/
├── app/api/location/route.ts          ← API endpoints
├── hooks/use-location.ts              ← React hooks
└── modules/@org/onboarding/_components/forms/
    └── company-profile.tsx            ← Updated component

Root/
├── LOCATION_SYSTEM_DOCS.md            ← Full documentation
├── LOCATION_EXAMPLES.md               ← Implementation examples
└── IMPLEMENTATION_SUMMARY.md          ← This summary
```

## Testing Checklist

- [ ] Countries dropdown shows ~195 countries with flags
- [ ] Selecting country enables states dropdown
- [ ] States dropdown populates with selected country's states
- [ ] Selecting state enables cities dropdown
- [ ] Cities dropdown populates with selected state's cities
- [ ] Form submission includes location values
- [ ] Loading indicators show while fetching
- [ ] No TypeScript errors in IDE
- [ ] All lint checks pass
- [ ] Network requests show successful API calls

## Performance Tips

1. Use `useLocationData()` when you need all three fields together
2. Use individual hooks only when you need fine-grained control
3. Don't create multiple instances of the hook in the same component
4. Let the hook handle state - don't manually duplicate it
5. Use `Controller` + `ComboBox` for consistent UI (like in company-profile)

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| States not loading | No country selected | Select a country first |
| Cities not loading | No country selected | Select a country first |
| API 400 error | Missing required params | Include `type` and `country` |
| API 500 error | External API down | Try again later |
| TypeScript errors | Wrong hook usage | Import from `/hooks/use-location` |

## External API Dependencies

These APIs are called by your backend:
- **REST Countries** (`restcountries.com`) - Countries list
- **Countries Now** (`countriesnow.space`) - States and cities

No additional setup needed - your API acts as a proxy.

---

**Last Updated**: November 19, 2025
**Version**: 1.0
**Status**: Production Ready
