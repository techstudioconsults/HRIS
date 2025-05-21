import { handleError } from "./errorHandler";

const tryCatchWrapper = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (error: unknown) {
    // This will handle 401/403 and throw all other errors
    handleError(error);

    // If we get here, it's a 401/403 that was handled
    throw error; // Still throw so component knows request failed
  }
};

export default tryCatchWrapper;
