"use client";

import { Pencil, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/category/hooks/use-categories";
import { uploadGearImage } from "@/features/gear/api/cloudinary.api";
import { useDeleteGear, useUpdateGear } from "@/features/gear/hooks/use-create-gear";
import type { Gear, GearAvailability } from "@/features/gear/types/gear.types";
import { fallbackGearImage } from "@/shared/utils/assets";
import { formatMoney } from "@/shared/utils/format";
import { useToastStore } from "@/stores/toast.store";

type Props = {
  gears: Gear[];
};

type Draft = {
  categoryId: string;
  title: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  availability: GearAvailability;
  image: string;
  specifications: string;
};

function specificationsToText(specifications?: Record<string, unknown>) {
  if (!specifications) return "";
  if (typeof specifications.notes === "string") return specifications.notes;
  return JSON.stringify(specifications);
}

function createDraft(gear: Gear): Draft {
  return {
    categoryId: gear.categoryId ?? gear.category?.id ?? "",
    title: gear.title,
    description: gear.description,
    brand: gear.brand,
    pricePerDay: Number(gear.pricePerDay),
    stock: gear.stock,
    availability: gear.availability,
    image: gear.image ?? "",
    specifications: specificationsToText(gear.specifications),
  };
}

export function ProviderInventoryManager({ gears }: Props) {
  const { data: categories } = useCategories();
  const updateGear = useUpdateGear();
  const deleteGear = useDeleteGear();
  const showToast = useToastStore((state) => state.showToast);
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploadingId, setUploadingId] = useState("");

  function startEditing(gear: Gear) {
    setEditingId(gear.id);
    setDraft(createDraft(gear));
  }

  function updateDraft(values: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...values } : current));
  }

  async function handleImageChange(gearId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({ title: "Invalid file", description: "Please choose an image file.", variant: "error" });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({ title: "Image is too large", description: "Please choose an image under 5 MB.", variant: "error" });
      event.target.value = "";
      return;
    }

    setUploadingId(gearId);

    try {
      const image = await uploadGearImage(file);
      updateDraft({ image });
      showToast({ title: "Image uploaded", description: "The replacement image is ready.", variant: "success" });
    } catch (error) {
      showToast({
        title: "Could not upload image",
        description: error instanceof Error ? error.message : "Please try another image.",
        variant: "error",
      });
    } finally {
      setUploadingId("");
    }
  }

  async function handleSave(gearId: string) {
    if (!draft) return;

    if (!draft.image) {
      showToast({ title: "Image required", description: "Please upload a product image before saving.", variant: "error" });
      return;
    }

    try {
      await updateGear.mutateAsync({
        gearId,
        payload: {
          ...draft,
          specifications: draft.specifications ? { notes: draft.specifications } : undefined,
        },
      });
      showToast({ title: "Gear updated", description: "Your listing changes have been saved.", variant: "success" });
      setEditingId("");
      setDraft(null);
    } catch (error) {
      showToast({
        title: "Could not update gear",
        description: error instanceof Error ? error.message : "Please check the listing details.",
        variant: "error",
      });
    }
  }

  async function handleDelete(gear: Gear) {
    const confirmed = window.confirm(`Delete "${gear.title}" from your inventory?`);
    if (!confirmed) return;

    try {
      await deleteGear.mutateAsync(gear.id);
      showToast({ title: "Gear deleted", description: "The listing has been removed.", variant: "success" });
    } catch (error) {
      showToast({
        title: "Could not delete gear",
        description: error instanceof Error ? error.message : "This listing may be connected to rentals.",
        variant: "error",
      });
    }
  }

  if (gears.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-black">No inventory yet</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Create your first gear listing to manage it here.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {gears.map((gear) => {
        const isEditing = editingId === gear.id && draft;

        return (
          <Card key={gear.id} className="p-4">
            {isEditing ? (
              <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
                <div className="space-y-3">
                  <div className="relative h-40 overflow-hidden rounded-md bg-zinc-100">
                    <Image src={draft.image || fallbackGearImage} alt={draft.title} fill unoptimized className="object-cover" />
                  </div>
                  <label className="block">
                    <span className="sr-only">Upload replacement image</span>
                    <Input type="file" accept="image/*" disabled={uploadingId === gear.id} onChange={(event) => handleImageChange(gear.id, event)} />
                  </label>
                </div>
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} />
                    <Input value={draft.brand} onChange={(event) => updateDraft({ brand: event.target.value })} />
                    <Select value={draft.categoryId} onChange={(event) => updateDraft({ categoryId: event.target.value })}>
                      <option value="">Category</option>
                      {categories?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </Select>
                    <Select value={draft.availability} onChange={(event) => updateDraft({ availability: event.target.value as GearAvailability })}>
                      <option value="AVAILABLE">Available</option>
                      <option value="OUT_OF_STOCK">Out of stock</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </Select>
                    <Input type="number" min={1} value={draft.pricePerDay} onChange={(event) => updateDraft({ pricePerDay: Number(event.target.value) })} />
                    <Input type="number" min={0} value={draft.stock} onChange={(event) => updateDraft({ stock: Number(event.target.value) })} />
                  </div>
                  <Textarea value={draft.description} onChange={(event) => updateDraft({ description: event.target.value })} />
                  <Textarea value={draft.specifications} onChange={(event) => updateDraft({ specifications: event.target.value })} />
                  <div className="flex flex-wrap gap-2">
                    <Button disabled={updateGear.isPending || uploadingId === gear.id} onClick={() => handleSave(gear.id)}>
                      <Save size={16} /> {uploadingId === gear.id ? "Uploading..." : updateGear.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => { setEditingId(""); setDraft(null); }}>
                      <X size={16} /> Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                <div className="relative h-28 overflow-hidden rounded-md bg-zinc-100">
                  <Image src={gear.image || fallbackGearImage} alt={gear.title} fill className="object-cover" sizes="120px" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black">{gear.title}</h3>
                    <StatusBadge value={gear.availability} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{gear.brand} | {gear.category?.name ?? "Uncategorized"} | {formatMoney(gear.pricePerDay)}/day</p>
                  <p className="mt-1 text-sm text-zinc-500">Stock: {gear.stock}</p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Button variant="secondary" onClick={() => startEditing(gear)}>
                    <Pencil size={16} /> Edit
                  </Button>
                  <Button variant="destructive" disabled={deleteGear.isPending} onClick={() => handleDelete(gear)}>
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
