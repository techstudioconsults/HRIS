import { handleError } from "./errorHandler";

// tryCatchWrapper.ts
export const tryCatchWrapper = async <T>(
  request: () => Promise<T>,
  customErrorHandler?: (error: unknown) => Error | void,
) => {
  try {
    return await request();
  } catch (error: unknown) {
    // Transform error if handler provided
    const transformedError = customErrorHandler?.(error) || error;
    // Handle the error (shows toast)
    handleError(transformedError);
  }
};
