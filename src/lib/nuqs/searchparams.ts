import { createSearchParamsCache, createSerializer, parseAsInteger, parseAsString } from "nuqs/server";

export const searchParameters = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  category: parseAsString,
};

export const searchParametersCache = createSearchParamsCache(searchParameters);
export const serialize = createSerializer(searchParameters);
