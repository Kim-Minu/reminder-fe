import api from "@/shared/lib/api";
import type { LoginRequest, MemberResponse, RegisterRequest, TokenResponse } from "../types";

export const authService = {
  register: async (data: RegisterRequest): Promise<MemberResponse> => {
    const { data: res } = await api.post<MemberResponse>("/api/auth/register", data);
    return res;
  },

  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const { data: res } = await api.post<TokenResponse>("/api/auth/login", data);
    return res;
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const { data: res } = await api.post<TokenResponse>("/api/auth/refresh", { refreshToken });
    return res;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post("/api/auth/logout", { refreshToken });
  },

  me: async (): Promise<MemberResponse> => {
    const { data: res } = await api.get<MemberResponse>("/api/members/me");
    return res;
  },
};
