# Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Component                       │
│              (company-profile.tsx or any form)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              React Hooks Layer                             │
│                                                            │
│  useLocationData()  ◄──────► useCountries()               │
│  (Composite)                 useStates()                   │
│                              useCities()                   │
│              (Individual Hooks)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼ fetch("/api/location?...")
┌─────────────────────────────────────────────────────────────┐
│         Next.js Backend API Layer                          │
│         GET /api/location (route.ts)                       │
│                                                            │
│  ┌─────────────┬──────────────┬────────────────┐          │
│  │ Type=       │ Type=        │ Type=          │          │
│  │ countries   │ states       │ cities         │          │
│  │             │              │                │          │
│  │ Get all     │ Get states   │ Get cities by │          │
│  │ countries   │ by country   │ country/state │          │
│  └─────────────┴──────────────┴────────────────┘          │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  ┌──────────┐  ┌──────────────┐  ┌──────────────┐
  │  REST    │  │  Countries   │  │  Countries   │
  │Countries │  │  Now API     │  │  Now API     │
  │ API      │  │ /countries   │  │ /cities &    │
  │          │  │              │  │ /state/cities│
  └──────────┘  └──────────────┘  └──────────────┘
```

## Data Flow Sequence

```
User Action                Component                Hook                API
─────────────             ─────────────          ─────────            ───

                          mount
                            │
                            ├──────────────────► useLocationData()
                                                  │
                                                  ├──────────────────► fetch
                                                  │                     countries
                                                  │                       │
                                                  │◄──────────────────────┘
                                                  │
                            ◄──────────────────── return countries []
                            │
     Select country         │
          │                 │
          └──────────────► field.onChange()
                            │
                            ├──────────────────► handleCountryChange()
                                                  │
                                                  ├──────────────────► fetch
                                                  │                     states
                                                  │◄──────────────────────┘
                                                  │
                            ◄──────────────────── return states []
                            │
                         [State field enabled]
                            │
     Select state           │
          │                 │
          └──────────────► field.onChange()
                            │
                            ├──────────────────► handleStateChange()
                                                  │
                                                  ├──────────────────► fetch
                                                  │                     cities
                                                  │◄──────────────────────┘
                                                  │
                            ◄──────────────────── return cities []
                            │
                         [City field enabled]
                            │
     Select city            │
          │                 │
          └──────────────► field.onChange()
                            │
     Submit form            │
          │                 │
          └──────────────► handleSubmit()
                            │
                         [Save country, state, city]
```

## Component Lifecycle

```
┌──────────────────────────────────┐
│      CompanyProfile Component    │
└────────────┬─────────────────────┘
             │
             ├─ mount()
             │   └─► useLocationData()
             │        └─► useCountries() ──► fetch /api/location?type=countries
             │        └─► useStates(null) ──► [loading: false, data: []]
             │        └─► useCities(null) ──► [loading: false, data: []]
             │
             ├─ country selected
             │   └─► watch("country")
             │   └─► useEffect([countryValue])
             │        └─► handleCountryChange(countryValue)
             │            └─► useStates(countryValue) ──► fetch /api/location?type=states&country=...
             │
             ├─ state selected
             │   └─► watch("state")
             │   └─► useEffect([stateValue])
             │        └─► handleStateChange(stateValue)
             │            └─► useCities(countryValue, stateValue) ──► fetch /api/location?type=cities...
             │
             └─ submit
                 └─► handleSubmit()
                      └─► updateCompanyProfile({
                              country: field.value,
                              state: field.value,
                              city: field.value,
                              ...
                          })
```

## Hook State Management

```
useLocationData()
    │
    ├── countries: LocationOption[]
    │   ├── value: string (lowercase)
    │   ├── label: string (with flag emoji)
    │   └── [195 countries]
    │
    ├── states: LocationOption[]
    │   ├── value: string (lowercase)
    │   ├── label: string
    │   └── [depends on selectedCountry]
    │
    ├── cities: LocationOption[]
    │   ├── value: string (lowercase)
    │   ├── label: string
    │   └── [depends on selectedCountry + selectedState]
    │
    ├── selectedCountry: string | null
    │   └── [from watch("country")]
    │
    ├── selectedState: string | null
    │   └── [from watch("state")]
    │
    ├── Loading states
    │   ├── countriesLoading: boolean
    │   ├── statesLoading: boolean
    │   └── citiesLoading: boolean
    │
    ├── Error states
    │   ├── countriesError: string | null
    │   ├── statesError: string | null
    │   └── citiesError: string | null
    │
    └── Handlers
        ├── handleCountryChange(country: string | null): void
        └── handleStateChange(state: string | null): void
```

## API Request/Response Flow

### Request 1: Get Countries
```
GET /api/location?type=countries

Response:
{
  "success": true,
  "data": [
    {
      "value": "afghanistan",
      "label": "🇦🇫 Afghanistan",
      "cca2": "AF",
      "commonName": "Afghanistan"
    },
    {
      "value": "albania",
      "label": "🇦🇱 Albania",
      "cca2": "AL",
      "commonName": "Albania"
    },
    ...
  ],
  "count": 195
}
```

### Request 2: Get States
```
GET /api/location?type=states&country=Nigeria

External Call:
→ GET https://countriesnow.space/api/v0.1/countries
← Parse response, find Nigeria, extract states

Response:
{
  "success": true,
  "data": [
    {
      "value": "abia",
      "label": "Abia"
    },
    {
      "value": "adamawa",
      "label": "Adamawa"
    },
    ...
    {
      "value": "lagos",
      "label": "Lagos"
    },
    ...
  ],
  "count": 37,
  "country": "Nigeria"
}
```

### Request 3: Get Cities
```
GET /api/location?type=cities&country=Nigeria&state=Lagos

External Call:
→ POST https://countriesnow.space/api/v0.1/countries/state/cities
  {"country": "Nigeria", "state": "Lagos"}
← Parse response, extract cities

Response:
{
  "success": true,
  "data": [
    {
      "value": "abule-egba",
      "label": "Abule Egba"
    },
    {
      "value": "agbara",
      "label": "Agbara"
    },
    ...
    {
      "value": "lekki",
      "label": "Lekki"
    },
    ...
  ],
  "count": 20,
  "country": "Nigeria",
  "state": "Lagos"
}
```

## Dependency Injection & Hook Calls

```
Component Render
    │
    ├─► useLocationData()
    │    │
    │    ├─► useCountries()
    │    │    ├─► useState([])
    │    │    ├─► useEffect(() => {
    │    │    │     fetch("/api/location?type=countries")
    │    │    │   })
    │    │    └─► return { countries, isLoading, error }
    │    │
    │    ├─► useStates(selectedCountry)
    │    │    ├─► useState([])
    │    │    ├─► useEffect(() => {
    │    │    │     if (!selectedCountry) return;
    │    │    │     fetch("/api/location?type=states&country=...")
    │    │    │   }, [selectedCountry])
    │    │    └─► return { states, isLoading, error }
    │    │
    │    ├─► useCities(selectedCountry, selectedState)
    │    │    ├─► useState([])
    │    │    ├─► useEffect(() => {
    │    │    │     if (!selectedCountry) return;
    │    │    │     fetch("/api/location?type=cities&country=...&state=...")
    │    │    │   }, [selectedCountry, selectedState])
    │    │    └─► return { cities, isLoading, error }
    │    │
    │    ├─► useState(selectedCountry)
    │    ├─► useState(selectedState)
    │    │
    │    └─► return {
    │         countries, states, cities,
    │         selectedCountry, selectedState,
    │         countriesLoading, statesLoading, citiesLoading,
    │         countriesError, statesError, citiesError,
    │         handleCountryChange, handleStateChange
    │        }
    │
    └─► render JSX with location dropdowns
        ├─► Country <ComboBox> options={countries}
        ├─► State <ComboBox> options={states} disabled={!selectedCountry}
        └─► City <ComboBox> options={cities} disabled={!selectedCountry}
```

## Error Handling Flow

```
API Call
    │
    ├─► response.ok?
    │   │
    │   ├─ YES ─► parse JSON
    │   │         │
    │   │         ├─ array.length > 0?
    │   │         │  │
    │   │         │  ├─ YES ─► setState(data)
    │   │         │  └─ NO ──► setState([])
    │   │         │            (empty result)
    │   │         │
    │   │         └─ return { success: true, data, count }
    │   │
    │   └─ NO ──► Check for fallback
    │            (e.g., state cities fails)
    │             │
    │             ├─ Fallback available?
    │             │  │
    │             │  ├─ YES ─► Try fallback
    │             │  │         (get all country cities)
    │             │  │
    │             │  └─ NO ──► setError(message)
    │             │            setState([])
    │             │            return error
    │
    └─► catch(error)
         │
         └─► setError(error.message)
              setState([])
              return error
```

## Caching Strategy

```
Browser Cache (24 hours via Next.js ISR)
    │
    ├─ GET /api/location?type=countries
    │   └─ Cache: revalidate: 86400 (24 hours)
    │      Next call within 24h: serves cached response
    │      After 24h: fetches fresh data
    │
    ├─ GET /api/location?type=states&country=...
    │   └─ Cache: revalidate: 86400
    │
    └─ GET /api/location?type=cities&country=...&state=...
        └─ Cache: revalidate: 86400
```

## External API Calls

```
Your Backend
    │
    ├─ Request: /api/location?type=countries
    │   │
    │   └─► Fetch from REST Countries
    │        GET https://restcountries.com/v3.1/all?fields=name,flags,cca2
    │        │
    │        ├─ Parse response
    │        ├─ Sort by name
    │        └─► Return formatted
    │
    ├─ Request: /api/location?type=states&country=Nigeria
    │   │
    │   └─► Fetch from Countries Now
    │        GET https://countriesnow.space/api/v0.1/countries
    │        │
    │        ├─ Find Nigeria
    │        ├─ Extract states
    │        ├─ Sort alphabetically
    │        └─► Return formatted
    │
    └─ Request: /api/location?type=cities&country=Nigeria&state=Lagos
        │
        └─► Fetch from Countries Now
             POST https://countriesnow.space/api/v0.1/countries/state/cities
             │   {"country": "Nigeria", "state": "Lagos"}
             │
             ├─ Get cities for state
             ├─ If fails, fallback to country cities
             ├─ Sort alphabetically
             └─► Return formatted
```

---

**Legend:**
- ─► : Data flow direction
- ▼ : Downward flow
- ◄─ : Return/Response
- │ : Connection
- ├ : Branch
- └ : End of branch
