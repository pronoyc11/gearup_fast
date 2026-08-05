"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCategories } from "@/features/category/hooks/use-categories";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { gearFilterSchema, type GearFilterValues } from "../schemas/gear.schemas";

type Props = {
  onFilterChange: (values: GearFilterValues) => void;
  onSearchChange: (searchTerm: string) => void;
};

export function GearFilterForm({ onFilterChange, onSearchChange }: Props) {
  const { data: categories } = useCategories();
  const form = useForm<GearFilterValues>({
    resolver: zodResolver(gearFilterSchema),
    defaultValues: { searchTerm: "", categoryName: "", brand: "", minPrice: "", maxPrice: "", availability: "" },
  });
  const searchTerm = useWatch({ control: form.control, name: "searchTerm" });
  const debouncedSearchTerm = useDebounce(searchTerm ?? "", 450);

  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  return (
    <Card className="h-fit p-4">
      <h1 className="mb-4 text-xl font-black">Browse Gear</h1>
      <form onSubmit={form.handleSubmit(onFilterChange)} className="space-y-3">
        <label className="block text-sm font-bold">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-zinc-400" size={18} />
          <Input className="pl-10" placeholder="Football, tent, Wilson..." {...form.register("searchTerm")} />
        </div>
        <label className="block text-sm font-bold">Category</label>
        <Select {...form.register("categoryName")}>
          <option value="">All categories</option>
          {categories?.map((category) => <option key={category.id}>{category.name}</option>)}
        </Select>
        <label className="block text-sm font-bold">Brand</label>
        <Input placeholder="Exact brand" {...form.register("brand")} />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-bold">Min</label>
            <Input type="number" {...form.register("minPrice")} />
          </div>
          <div>
            <label className="block text-sm font-bold">Max</label>
            <Input type="number" {...form.register("maxPrice")} />
          </div>
        </div>
        <label className="block text-sm font-bold">Availability</label>
        <Select {...form.register("availability")}>
          <option value="">Any</option>
          <option value="AVAILABLE">Available</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
          <option value="MAINTENANCE">Maintenance</option>
        </Select>
        <Button type="submit" variant="secondary" className="w-full">Apply Filters</Button>
      </form>
    </Card>
  );
}
