import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const shopSearchParameters = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(12),
  search: parseAsString,
  category: parseAsString,
  vendor: parseAsString,
  sort: parseAsStringEnum(["name", "price", "rating", "newest"]).withDefault("newest"),
};

export const shopSearchParametersCache = createSearchParamsCache(shopSearchParameters);
export const serializeShopParameters = createSerializer(shopSearchParameters);
