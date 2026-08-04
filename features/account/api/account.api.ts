import { apiClient } from "@/shared/api/axios";
import type { User } from "@/features/auth/types/auth.types";
import type { UpdateProfilePayload } from "../types/account.types";

export const accountApi = {
  updateProfile: (payload: UpdateProfilePayload) => apiClient.patch<unknown, User>("/api/user/update-profile", payload),
  deleteProfile: () => apiClient.delete<unknown, User>("/api/user/delete-profile"),
};
