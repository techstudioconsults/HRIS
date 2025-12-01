import { createSearchParamsCache, createSerializer, parseAsInteger, parseAsString } from "nuqs/server";

export const searchParameters = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParametersCache = createSearchParamsCache(searchParameters);
export const serialize = createSerializer(searchParameters);
