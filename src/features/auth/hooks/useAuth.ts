import { useMutation } from "@tanstack/react-query";
import { setAuthToken } from "@/shared/lib/api";
import { authService } from "../services/authService";
import useAuthStore from "../store/authStore";

export function useLogin() {
  const { setTokens, setUser } = useAuthStore();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: async ({ accessToken, refreshToken }) => {
      setTokens(accessToken, refreshToken);
      setAuthToken(accessToken);
      const user = await authService.me();
      setUser(user);
    },
  });
}

export function useRegister() {
  return useMutation({ mutationFn: authService.register });
}

export function useLogout() {
  const { refreshToken, clearTokens } = useAuthStore();
  return useMutation({
    mutationFn: () => authService.logout(refreshToken!),
    onSettled: () => {
      clearTokens();
      setAuthToken(null);
    },
  });
}
