# Location System - Usage Examples

This document provides practical examples of how to use the location system in various scenarios.

## Example 1: Simple Location Form with React Hook Form

```typescript
import { useLocationData } from "@/hooks/use-location";
import { Controller, useForm } from "react-hook-form";

function SimpleLocationForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { country: "", state: "", city: "" },
  });

  const {
    countries,
    states,
    cities,
    selectedCountry,
    countriesLoading,
    statesLoading,
    citiesLoading,
    handleCountryChange,
    handleStateChange,
  } = useLocationData();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <select
            {...field}
            onChange={(event_) => {
              field.onChange(event_);
              handleCountryChange(event_.target.value || null);
            }}
            disabled={countriesLoading}
          >
            <option value="">Select Country</option>
            {countries.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      />

      <Controller
        name="state"
        control={control}
        render={({ field }) => (
          <select
            {...field}
            onChange={(event_) => {
              field.onChange(event_);
              handleStateChange(event_.target.value || null);
            }}
            disabled={statesLoading || !selectedCountry}
          >
            <option value="">Select State</option>
            {states.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      />

      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <select {...field} disabled={citiesLoading || !selectedCountry}>
            <option value="">Select City</option>
            {cities.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Example 2: Using Individual Hooks

If you prefer more granular control, use the individual hooks:

```typescript
import { useCountries, useStates, useCities } from "@/hooks/use-location";
import { useState } from "react";

function IndividualHooksExample() {
  const [country, setCountry] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);

  const { countries } = useCountries();
  const { states } = useStates(country);
  const { cities } = useCities(country, state);

  return (
    <div>
      <select
        value={country || ""}
        onChange={(event_) => setCountry(event_.target.value || null)}
      >
        <option value="">Select Country</option>
        {countries.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={state || ""}
        onChange={(event_) => setState(event_.target.value || null)}
        disabled={!country}
      >
        <option value="">Select State</option>
        {states.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select disabled={!country}>
        <option value="">Select City</option>
        {cities.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}
```

## Example 3: Direct API Fetch

For simple scenarios, you can call the API directly:

```typescript
async function fetchCountriesDirectly() {
  const response = await fetch("/api/location?type=countries");
  const data = await response.json();
  return data.data;
}

async function fetchStatesByCountry(country: string) {
  const response = await fetch(
    `/api/location?type=states&country=${encodeURIComponent(country)}`
  );
  const data = await response.json();
  return data.data;
}

async function fetchCitiesByCountryAndState(country: string, state: string) {
  const response = await fetch(
    `/api/location?type=cities&country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}`
  );
  const data = await response.json();
  return data.data;
}
```

## Example 4: With React Query (Recommended for Performance)

For better caching and performance, use React Query:

```typescript
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function LocationWithReactQuery() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Query for countries
  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetch("/api/location?type=countries");
      const data = await response.json();
      return data.data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Query for states
  const { data: states = [] } = useQuery({
    queryKey: ["states", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const response = await fetch(
        `/api/location?type=states&country=${encodeURIComponent(selectedCountry)}`
      );
      const data = await response.json();
      return data.data;
    },
    enabled: !!selectedCountry,
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Query for cities
  const { data: cities = [] } = useQuery({
    queryKey: ["cities", selectedCountry, selectedState],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const parameters = new URLSearchParams({
        type: "cities",
        country: selectedCountry,
      });
      if (selectedState) parameters.append("state", selectedState);

      const response = await fetch(`/api/location?${parameters.toString()}`);
      const data = await response.json();
      return data.data;
    },
    enabled: !!selectedCountry,
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <div>
      <select
        value={selectedCountry || ""}
        onChange={(event_) => setSelectedCountry(event_.target.value || null)}
      >
        <option value="">Select Country</option>
        {countries.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select
        value={selectedState || ""}
        onChange={(event_) => setSelectedState(event_.target.value || null)}
        disabled={!selectedCountry}
      >
        <option value="">Select State</option>
        {states.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select disabled={!selectedCountry}>
        <option value="">Select City</option>
        {cities.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}
```

## Example 5: City Search & Filter

Add search functionality to cities:

```typescript
import { useCities } from "@/hooks/use-location";
import { useMemo, useState } from "react";

function CitySearchExample() {
  const [country, setCountry] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { cities } = useCities(country, state);

  const filteredCities = useMemo(() => {
    if (!searchTerm) return cities;
    return cities.filter((city) =>
      city.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cities, searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search cities..."
        value={searchTerm}
        onChange={(event_) => setSearchTerm(event_.target.value)}
        disabled={!country}
      />
      <select disabled={!country}>
        <option value="">Select City</option>
        {filteredCities.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}
```

## Example 6: Location Selection Dialog

Create a reusable location selection modal:

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocationData } from "@/hooks/use-location";
import { useState } from "react";

interface LocationSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: { country: string; state: string | null; city: string }) => void;
}

function LocationSelectionDialog({ isOpen, onClose, onSelect }: LocationSelectionDialogProps) {
  const [country, setCountry] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);

  const { countries, states, cities, handleCountryChange, handleStateChange } = useLocationData();

  const handleSelect = () => {
    if (country && city) {
      onSelect({ country, state: state || null, city });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <select
            value={country || ""}
            onChange={(event_) => {
              const newCountry = event_.target.value || null;
              setCountry(newCountry);
              setState(null);
              setCity(null);
              handleCountryChange(newCountry);
            }}
          >
            <option value="">Select Country</option>
            {countries.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {country && (
            <select
              value={state || ""}
              onChange={(event_) => {
                const newState = event_.target.value || null;
                setState(newState);
                setCity(null);
                handleStateChange(newState);
              }}
            >
              <option value="">Select State</option>
              {states.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          )}

          {country && (
            <select
              value={city || ""}
              onChange={(event_) => setCity(event_.target.value || null)}
            >
              <option value="">Select City</option>
              {cities.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleSelect}
          disabled={!country || !city}
          className="w-full bg-blue-500 text-white rounded p-2"
        >
          Select Location
        </button>
      </DialogContent>
    </Dialog>
  );
}
```

## Testing Examples

### Test Countries Endpoint

```bash
curl "http://localhost:3000/api/location?type=countries" | jq '.data | length'
# Output: 195
```

### Test States for Nigeria

```bash
curl "http://localhost:3000/api/location?type=states&country=Nigeria" | jq '.data'
# Output: [{"value": "abia", "label": "Abia"}, ...]
```

### Test Cities in Lagos State

```bash
curl "http://localhost:3000/api/location?type=cities&country=Nigeria&state=Lagos" | jq '.data'
# Output: [{"value": "lagos", "label": "Lagos"}, ...]
```

## Key Points

1. **Always use the composite hook (`useLocationData`)** when you need all three fields synced together
2. **Use individual hooks** only when you need more control over state management
3. **Implement loading states** while data is being fetched
4. **Disable dependent fields** until their parent field is selected
5. **Cache results** using Next.js ISR or React Query for better performance
6. **Handle errors gracefully** - provide fallback UI when API fails
