import { useMutation } from "@tanstack/react-query";

import { AuthService } from "../services/service";
import { useAuthStore } from "../stores/store";

export const useAuth = () => {
  const { setUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (user) => {
      setUser(user);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
  };
};
