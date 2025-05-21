import { toast } from "sonner";

export const handleError = (error: unknown, fallbackMessage?: string): string => {
  let message = fallbackMessage || "Something went wrong";

  if (typeof error === "object" && error !== null && "response" in error) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string } } };

    if (axiosError.response?.status === 401) {
      window.location.href = "/auth/login";
      return "Unauthorized";
    }

    message = axiosError.response?.data?.message || fallbackMessage || "Unknown server error";
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (typeof window !== "undefined") {
    toast.error("Something went wrong!", {
      description: message,
    });
  }

  return message;
};
