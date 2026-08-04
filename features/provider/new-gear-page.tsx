"use client";

import { api, type GearInput } from "@/lib/api";
import { GearAvailability } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewGearPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const create = useMutation({
    mutationFn: api.createGear,
    onSuccess: () => router.push("/dashboard/provider"),
    onError: (err) => setError(err.message),
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body: GearInput = {
      categoryId: String(f.get("categoryId")),
      title: String(f.get("title")),
      description: String(f.get("description")),
      brand: String(f.get("brand")),
      pricePerDay: Number(f.get("pricePerDay")),
      stock: Number(f.get("stock")),
      availability: f.get("availability") as GearAvailability,
      image: String(f.get("image") || ""),
      specifications: { notes: String(f.get("specifications") || "") },
    };
    create.mutate(body);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <form onSubmit={submit} className="panel space-y-4 p-6">
        <div className="flex items-center gap-2"><PackagePlus className="text-teal-700" /><h1 className="text-2xl font-black">Add Gear</h1></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input required className="input" name="title" placeholder="Title" />
          <input required className="input" name="brand" placeholder="Brand" />
          <select required className="input" name="categoryId"><option value="">Category</option>{categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select className="input" name="availability" defaultValue="AVAILABLE"><option value="AVAILABLE">Available</option><option value="OUT_OF_STOCK">Out of stock</option><option value="MAINTENANCE">Maintenance</option></select>
          <input required className="input" name="pricePerDay" type="number" min={1} placeholder="Price per day" />
          <input required className="input" name="stock" type="number" min={0} placeholder="Stock" />
          <input className="input sm:col-span-2" name="image" type="url" placeholder="Image URL" />
          <textarea required className="input sm:col-span-2" name="description" placeholder="Description" rows={4} />
          <textarea className="input sm:col-span-2" name="specifications" placeholder="Specifications notes" rows={3} />
        </div>
        {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
        <button className="btn btn-primary w-full" disabled={create.isPending}>{create.isPending ? "Saving..." : "Create Gear"}</button>
      </form>
    </main>
  );
}
