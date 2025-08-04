import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const productSearchParameters = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  search: parseAsString,
  status: parseAsStringEnum(["all", "published", "draft"]).withDefault("all"),
};

export const productSearchParametersCache = createSearchParamsCache(productSearchParameters);
export const serializeProductParameters = createSerializer(productSearchParameters);
