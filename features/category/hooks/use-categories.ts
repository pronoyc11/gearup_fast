"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}
