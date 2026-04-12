import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken, registerAuthHandlers } from "@/shared/lib/api";
import { AUTH_STORAGE_KEY } from "@/shared/constants";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  clearTokens: () => void;
  isAuthenticated: () => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clearTokens: () => set({ accessToken: null, refreshToken: null, user: null }),
      isAuthenticated: () => get().accessToken !== null,
    }),
    {
      name: AUTH_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) setAuthToken(state.accessToken);
      },
    }
  )
);

registerAuthHandlers(
  () => useAuthStore.getState().refreshToken,
  (accessToken, refreshToken) => useAuthStore.getState().setTokens(accessToken, refreshToken),
  () => {
    setAuthToken(null);
    useAuthStore.getState().clearTokens();
  },
);

export default useAuthStore;
