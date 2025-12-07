import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { ForgotPasswordData, LoginOTPFFormData, RegisterFormData, ResetPasswordData } from "@/schemas";

import { AuthService } from "./auth.service";

export const useAuthService = () => {
  const { useServiceMutation } = createServiceHooks<AuthService>(dependencies.AUTH_SERVICE);

  // Mutations
  const useSignUp = () => useServiceMutation((service, data: RegisterFormData) => service.signUp(data));

  const useForgotPassword = () =>
    useServiceMutation((service, data: ForgotPasswordData) => service.forgotPassword(data));

  const useRequestOTP = () => useServiceMutation((service, data: LoginOTPFFormData) => service.requestOTP(data));

  const useLoginWithOTP = () => useServiceMutation((service, data: LoginOTPFFormData) => service.loginWithOTP(data));

  const useResetPassword = () => useServiceMutation((service, data: ResetPasswordData) => service.resetPassword(data));

  return {
    // Queries

    // Mutations
    useSignUp,
    useRequestOTP,
    useLoginWithOTP,
    useForgotPassword,
    useResetPassword,
  };
};
