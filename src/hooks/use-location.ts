"use client";

import { useCallback, useEffect, useState } from "react";

interface LocationOption {
  value: string;
  label: string;
}

interface LocationResponse {
  success: boolean;
  data: LocationOption[];
  count: number;
  message?: string;
}

/**
 * Hook for fetching countries
 */
export function useCountries() {
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/location?type=countries");

        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }

        const data = (await response.json()) as LocationResponse;
        setCountries(data.data);
      } catch (error_) {
        const message = error_ instanceof Error ? error_.message : "Unknown error";
        setError(message);
        setCountries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, isLoading, error };
}

/**
 * Hook for fetching states based on country
 */
export function useStates(country: string | null) {
  const [states, setStates] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!country) {
      setStates([]);
      return;
    }

    const fetchStates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/location?type=states&country=${encodeURIComponent(country)}`);

        if (!response.ok) {
          throw new Error("Failed to fetch states");
        }

        const data = (await response.json()) as LocationResponse;
        setStates(data.data);
      } catch (error_) {
        const message = error_ instanceof Error ? error_.message : "Unknown error";
        setError(message);
        setStates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, [country]);

  return { states, isLoading, error };
}

/**
 * Hook for fetching cities based on country and optional state
 */
export function useCities(country: string | null, state?: string | null) {
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!country) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const parameters = new URLSearchParams({
          type: "cities",
          country: country,
        });

        if (state) {
          parameters.append("state", state);
        }

        const response = await fetch(`/api/location?${parameters.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }

        const data = (await response.json()) as LocationResponse;
        setCities(data.data);
      } catch (error_) {
        const message = error_ instanceof Error ? error_.message : "Unknown error";
        setError(message);
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [country, state]);

  return { cities, isLoading, error };
}

/**
 * Composite hook for managing all location fields
 */
export function useLocationData() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const { countries, isLoading: countriesLoading, error: countriesError } = useCountries();
  const { states, isLoading: statesLoading, error: statesError } = useStates(selectedCountry);
  const { cities, isLoading: citiesLoading, error: citiesError } = useCities(selectedCountry, selectedState);

  const handleCountryChange = useCallback((country: string | null) => {
    setSelectedCountry(country);
    setSelectedState(null);
  }, []);

  const handleStateChange = useCallback((state: string | null) => {
    setSelectedState(state);
  }, []);

  return {
    // Data
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,

    // Loading states
    isLoading: countriesLoading || statesLoading || citiesLoading,
    countriesLoading,
    statesLoading,
    citiesLoading,

    // Errors
    error: countriesError || statesError || citiesError,
    countriesError,
    statesError,
    citiesError,

    // Handlers
    handleCountryChange,
    handleStateChange,
  };
}
