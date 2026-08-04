"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCategory } from "../hooks/use-categories";
import { categorySchema, type CategoryFormValues } from "../schemas/category.schemas";

export function CategoryForm() {
  const createCategory = useCreateCategory();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(values: CategoryFormValues) {
    await createCategory.mutateAsync(values);
    form.reset();
  }

  return (
    <Card className="space-y-3 p-5">
      <h2 className="font-black">Create Category</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <Input placeholder="Category name" {...form.register("name")} />
        <Textarea placeholder="Description" {...form.register("description")} />
        <div className="text-sm font-semibold text-red-700">{form.formState.errors.name?.message ?? createCategory.error?.message}</div>
        <Button className="w-full" disabled={createCategory.isPending}>Create</Button>
      </form>
    </Card>
  );
}
