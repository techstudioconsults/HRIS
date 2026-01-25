import { AxiosError } from "axios";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return undefined;
};

const flattenUnknownToStrings = (value: unknown): string[] => {
  const direct = asString(value);
  if (direct) return [direct];

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenUnknownToStrings(item));
  }

  if (isRecord(value)) {
    // common shapes:
    // - { field: ["error1", "error2"], otherField: "error" }
    // - { errors: { field: [..] } }
    return Object.values(value).flatMap((item) => flattenUnknownToStrings(item));
  }

  return [];
};

/**
 * Extract one or more human-friendly error messages from an unknown backend/client error.
 *
 * Supports common API response shapes:
 * - NestJS: { message: string | string[], statusCode, error }
 * - Validation: { message: { field: string[] } } or { errors: { field: string[] } }
 * - Generic: { message, error, title }
 */
export const getApiErrorMessages = (error: unknown, fallbackMessage = "Something went wrong"): string[] => {
  // Axios error
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (isRecord(data)) {
      // Prefer explicit validation error buckets first
      if ("errors" in data) {
        const messages = flattenUnknownToStrings((data as UnknownRecord).errors);
        if (messages.length > 0) return messages;
      }

      if ("message" in data) {
        const messages = flattenUnknownToStrings((data as UnknownRecord).message);
        if (messages.length > 0) return messages;
      }

      // Other common message fields
      for (const key of ["error", "title", "detail"] as const) {
        if (key in data) {
          const messageString = asString((data as UnknownRecord)[key]);
          if (messageString) return [messageString];
        }
      }
    }

    // Fallback to Axios message
    if (error.message) return [error.message];
    return [fallbackMessage];
  }

  // Non-Axios Error instance
  if (error instanceof Error) {
    return [error.message || fallbackMessage];
  }

  // Plain object errors thrown by adapters
  if (isRecord(error)) {
    if ("errors" in error) {
      const messages = flattenUnknownToStrings(error.errors);
      if (messages.length > 0) return messages;
    }

    if ("message" in error) {
      const messages = flattenUnknownToStrings(error.message);
      if (messages.length > 0) return messages;
    }
  }

  const maybeString = asString(error);
  if (maybeString) return [maybeString];

  return [fallbackMessage];
};

export const getApiErrorMessage = (error: unknown, fallbackMessage = "Something went wrong"): string => {
  const messages = getApiErrorMessages(error, fallbackMessage)
    .map((m) => m.trim())
    .filter(Boolean);
  // Sonner toast description renders best as a single sentence/paragraph.
  return messages.join("\n");
};
