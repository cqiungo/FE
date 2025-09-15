import axiosClient from "./axiosClient";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth.type.ts";

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    axiosClient.post("/auth/login", data),
  register: (data: RegisterRequest)=>
    axiosClient.post("/auth/register", data),
};
