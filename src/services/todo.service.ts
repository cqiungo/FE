// src/services/auth.service.ts
import { authApi } from "../api/auth.api";
import type { LoginRequest, LoginResponse } from "../types/auth.type";
import { userApi } from "@/api/user.api";
export const todoService = {
  async login(data: LoginRequest) {
    const res: LoginResponse = await authApi.login(data);

    // Lưu token & user vào localStorage
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("USER_KEY", JSON.stringify(res.user));

    return res;
  },

  async getTodoList(id: string) {
    return await userApi.getToDolistByUser(id);
  },

  logout() {
    localStorage.removeItem("access_token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
  getUser() {
    const user = localStorage.getItem("USER_KEY");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("access_token");
  },

};
