// src/services/auth.service.ts
import { authApi } from "../api/auth.api";
import type { LoginRequest, RegisterRequest } from "../types/auth.type";

export const authService = {
  async login(data: LoginRequest) {
    const res = await authApi.login(data);
    localStorage.setItem("access_token", res.access_token);
    return res;
  },

  async register(data: RegisterRequest) {
    return authApi.register(data);
  },

  logout() {
    localStorage.removeItem("access_token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};
