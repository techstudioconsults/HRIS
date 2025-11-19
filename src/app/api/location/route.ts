import { NextRequest, NextResponse } from "next/server";

const COUNTRIES_NOW_API = "https://countriesnow.space/api/v0.1";
const REST_COUNTRIES_API = "https://restcountries.com/v3.1";
const REVALIDATE_TIME = 24 * 60 * 60; // 24 hours in seconds

interface FormattedCountry {
  value: string;
  label: string;
  cca2: string;
  commonName: string;
}

interface FormattedLocation {
  value: string;
  label: string;
}

interface CountryInfo {
  name: {
    common: string;
  };
  flags?: {
    unicode?: string;
  };
  cca2: string;
}

export async function GET(request: NextRequest) {
  const searchParameters = request.nextUrl.searchParams;
  const type = searchParameters.get("type");

  try {
    switch (type) {
      case "countries": {
        return await getCountries();
      }
      case "states": {
        const country = searchParameters.get("country");
        if (!country) {
          return NextResponse.json({ error: "Country parameter is required for states" }, { status: 400 });
        }
        return await getStates(country);
      }
      case "cities": {
        const country = searchParameters.get("country");
        const state = searchParameters.get("state");
        if (!country) {
          return NextResponse.json({ error: "Country parameter is required for cities" }, { status: 400 });
        }
        return await getCities(country, state);
      }
      default: {
        return NextResponse.json(
          { error: "Invalid type parameter. Use 'countries', 'states', or 'cities'" },
          { status: 400 },
        );
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Location API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch location data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function getCountries(): Promise<NextResponse> {
  const response = await fetch(`${REST_COUNTRIES_API}/all?fields=name,flags,cca2`, {
    next: { revalidate: REVALIDATE_TIME },
  });

  if (!response.ok) {
    throw new Error(`REST Countries API error: ${response.statusText}`);
  }

  const countries = (await response.json()) as CountryInfo[];

  const formatted: FormattedCountry[] = countries
    .map((country) => ({
      value: country.name.common.toLowerCase(),
      label: `${country.flags?.unicode || ""} ${country.name.common}`,
      cca2: country.cca2,
      commonName: country.name.common,
    }))
    .sort((a, b) => a.commonName.localeCompare(b.commonName));

  return NextResponse.json({
    success: true,
    data: formatted,
    count: formatted.length,
  });
}

async function getStates(country: string): Promise<NextResponse> {
  // Capitalize first letter for API compatibility
  const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1);

  const response = await fetch(
    `${COUNTRIES_NOW_API}/countries/states/q?country=${encodeURIComponent(formattedCountry)}`,
    {
      next: { revalidate: REVALIDATE_TIME },
    },
  );

  if (!response.ok) {
    throw new Error(`Countries Now API error: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    error: boolean;
    msg: string;
    data: {
      name: string;
      iso3: string;
      iso2: string;
      states: Array<{ name: string; state_code: string }>;
    };
  };

  if (data.error || !data.data?.states) {
    return NextResponse.json(
      {
        success: true,
        data: [],
        message: `No states found for country: ${country}`,
      },
      { status: 200 },
    );
  }

  const states: FormattedLocation[] = data.data.states
    .map((state) => ({
      value: state.name.toLowerCase(),
      label: state.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return NextResponse.json({
    success: true,
    data: states,
    count: states.length,
    country: data.data.name,
  });
}

async function getCities(country: string, state?: string | null): Promise<NextResponse> {
  if (state && state.trim()) {
    const response = await fetch(`${COUNTRIES_NOW_API}/countries/state/cities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: country.charAt(0).toUpperCase() + country.slice(1),
        state: state.charAt(0).toUpperCase() + state.slice(1),
      }),
      next: { revalidate: REVALIDATE_TIME },
    });

    if (!response.ok) {
      return getCitiesByCountry(country);
    }

    const data = (await response.json()) as { data: string[] };

    if (!data.data || data.data.length === 0) {
      return getCitiesByCountry(country);
    }

    const cities: FormattedLocation[] = data.data
      .map((city) => ({
        value: city.toLowerCase(),
        label: city,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return NextResponse.json({
      success: true,
      data: cities,
      count: cities.length,
      country,
      state,
    });
  }

  return getCitiesByCountry(country);
}

async function getCitiesByCountry(country: string): Promise<NextResponse> {
  const response = await fetch(`${COUNTRIES_NOW_API}/countries/cities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      country: country.charAt(0).toUpperCase() + country.slice(1),
    }),
    next: { revalidate: REVALIDATE_TIME },
  });

  if (!response.ok) {
    throw new Error(`Countries Now API error: ${response.statusText}`);
  }

  const data = (await response.json()) as { data: string[] };

  const cities: FormattedLocation[] = (data.data || [])
    .map((city) => ({
      value: city.toLowerCase(),
      label: city,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return NextResponse.json({
    success: true,
    data: cities,
    count: cities.length,
    country,
  });
}
