"use client";

import { useRouter, useSearchParams } from "next/navigation";

export const useSearchParameters = (key: string) => {
  const searchParameters = useSearchParams();
  const value = searchParameters.get(key);
  return value;
};

export const updateQueryParamameters = (
  router: ReturnType<typeof useRouter>,
  pathname: string,
  currentParameters: URLSearchParams,
  updates: Record<string, string | null>,
) => {
  const parameters = new URLSearchParams([...currentParameters.entries()]);

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === "") {
      parameters.delete(key);
    } else {
      parameters.set(key, value);
    }
  }

  const search = parameters.toString();
  const query = search ? `?${search}` : "";

  router.push(`${pathname}${query}`, { scroll: false });
};
