import { apiClient } from "@/shared/api/axios";
import type { User } from "@/features/auth/types/auth.types";
import type { UpdateProfilePayload } from "../types/account.types";

export const accountApi = {
  getProfile: (accessToken?: string) =>
    apiClient.get<unknown, User>(
      "/api/user/me",
      accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
    ),
  updateProfile: (payload: UpdateProfilePayload, accessToken?: string) =>
    apiClient.patch<unknown, User>(
      "/api/user/update-profile",
      payload,
      accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
    ),
  deleteProfile: (accessToken?: string) =>
    apiClient.delete<unknown, User>(
      "/api/user/delete-profile",
      accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
    ),
};
