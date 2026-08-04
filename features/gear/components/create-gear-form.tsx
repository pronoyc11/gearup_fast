"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/category/hooks/use-categories";
import { useCreateGear } from "../hooks/use-create-gear";
import { gearSchema, type GearFormValues } from "../schemas/gear.schemas";

export function CreateGearForm() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const createGear = useCreateGear();
  const form = useForm<GearFormValues>({
    resolver: zodResolver(gearSchema),
    defaultValues: {
      categoryId: "",
      title: "",
      description: "",
      brand: "",
      pricePerDay: 1,
      stock: 0,
      availability: "AVAILABLE",
      image: "",
      specifications: "",
    },
  });

  async function onSubmit(values: GearFormValues) {
    await createGear.mutateAsync({
      ...values,
      image: values.image || undefined,
      specifications: values.specifications ? { notes: values.specifications } : undefined,
    });
    router.push("/dashboard/provider");
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2"><PackagePlus className="text-teal-700" /><h1 className="text-2xl font-black">Add Gear</h1></div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Title" {...form.register("title")} />
          <Input placeholder="Brand" {...form.register("brand")} />
          <Select {...form.register("categoryId")}><option value="">Category</option>{categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select>
          <Select {...form.register("availability")}><option value="AVAILABLE">Available</option><option value="OUT_OF_STOCK">Out of stock</option><option value="MAINTENANCE">Maintenance</option></Select>
          <Input type="number" min={1} placeholder="Price per day" {...form.register("pricePerDay")} />
          <Input type="number" min={0} placeholder="Stock" {...form.register("stock")} />
          <Input className="sm:col-span-2" type="url" placeholder="Image URL" {...form.register("image")} />
          <Textarea className="sm:col-span-2" placeholder="Description" {...form.register("description")} />
          <Textarea className="sm:col-span-2" placeholder="Specifications notes" {...form.register("specifications")} />
        </div>
        <div className="text-sm font-semibold text-red-700">{Object.values(form.formState.errors)[0]?.message ?? createGear.error?.message}</div>
        <Button className="w-full" disabled={createGear.isPending}>{createGear.isPending ? "Saving..." : "Create Gear"}</Button>
      </form>
    </Card>
  );
}
