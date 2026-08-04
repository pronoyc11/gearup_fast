import { apiClient } from "@/shared/api/axios";
import type { LoginPayload, LoginResponse, RegisterPayload, User } from "../types/auth.types";

export const authApi = {
  login: (payload: LoginPayload) => apiClient.post<unknown, LoginResponse>("/api/auth/login", payload),
  register: (payload: RegisterPayload) => apiClient.post<unknown, User>("/api/auth/register", payload),
  me: () => apiClient.get<unknown, User>("/api/user/me"),
};
