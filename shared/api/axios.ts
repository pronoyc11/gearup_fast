"use client";

import axios from "axios";
import { env } from "@/shared/config/env";
import { useAuthStore } from "@/stores/auth.store";
import { unwrapData } from "./response";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => unwrapData(response.data),
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  },
);
