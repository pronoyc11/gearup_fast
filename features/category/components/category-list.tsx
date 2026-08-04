"use client";

import { Card } from "@/components/ui/card";
import { useCategories, useDeleteCategory } from "../hooks/use-categories";

export function CategoryList() {
  const { data: categories } = useCategories();
  const deleteCategory = useDeleteCategory();

  return (
    <Card className="p-5">
      <h2 className="mb-3 font-black">Categories</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {categories?.map((category) => (
          <div key={category.id} className="flex items-center justify-between rounded-md border border-zinc-200 p-3">
            <span className="font-semibold">{category.name}</span>
            <button className="text-sm font-bold text-red-700" onClick={() => deleteCategory.mutate(category.id)}>Delete</button>
          </div>
        ))}
      </div>
    </Card>
  );
}
