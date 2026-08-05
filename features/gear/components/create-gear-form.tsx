"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, PackagePlus, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/category/hooks/use-categories";
import { useToastStore } from "@/stores/toast.store";
import { uploadGearImage } from "../api/cloudinary.api";
import { useCreateGear } from "../hooks/use-create-gear";
import { gearSchema, type GearFormValues } from "../schemas/gear.schemas";

export function CreateGearForm() {
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);
  const { data: categories } = useCategories();
  const createGear = useCreateGear();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
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
  const uploadedImageUrl = useWatch({ control: form.control, name: "image" });

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
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

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return localPreviewUrl;
    });
    setIsUploadingImage(true);
    form.clearErrors("image");

    try {
      const imageUrl = await uploadGearImage(file);
      form.setValue("image", imageUrl, { shouldDirty: true, shouldValidate: true });
      setPreviewUrl(imageUrl);
      showToast({ title: "Image uploaded", description: "The product image is ready.", variant: "success" });
    } catch (error) {
      form.setValue("image", "", { shouldDirty: true, shouldValidate: true });
      form.setError("image", {
        message: error instanceof Error ? error.message : "Could not upload the image. Please try again.",
      });
      showToast({
        title: "Could not upload image",
        description: error instanceof Error ? error.message : "Please try another image.",
        variant: "error",
      });
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function onSubmit(values: GearFormValues) {
    if (isUploadingImage) {
      showToast({ title: "Image still uploading", description: "Please wait for the image upload to finish.", variant: "info" });
      return;
    }

    try {
      await createGear.mutateAsync({
        ...values,
        image: values.image || undefined,
        specifications: values.specifications ? { notes: values.specifications } : undefined,
      });
      showToast({ title: "Gear created", description: "Your inventory has been updated.", variant: "success" });
      router.push("/dashboard/provider");
    } catch (error) {
      showToast({ title: "Could not create gear", description: error instanceof Error ? error.message : "Please check the form.", variant: "error" });
    }
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
          <Input type="number" min={1} placeholder="Price per day" {...form.register("pricePerDay", { valueAsNumber: true })} />
          <Input type="number" min={0} placeholder="Stock" {...form.register("stock", { valueAsNumber: true })} />
          <div className="space-y-3 sm:col-span-2">
            <label className="grid cursor-pointer gap-3 rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center transition hover:border-teal-600 dark:border-zinc-700 dark:bg-zinc-900">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-white text-teal-700 shadow-sm dark:bg-zinc-950">
                {isUploadingImage ? <UploadCloud size={20} /> : <ImagePlus size={20} />}
              </span>
              <span className="font-bold">{isUploadingImage ? "Uploading image..." : "Upload product image"}</span>
              <span className="text-sm text-zinc-500">Choose a JPG, PNG, or WebP image from your device.</span>
              <Input className="sr-only" type="file" accept="image/*" disabled={isUploadingImage} onChange={handleImageChange} />
            </label>
            {previewUrl ? (
              <div className="relative h-56 overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <Image src={previewUrl} alt="Product preview" fill unoptimized className="object-cover" />
              </div>
            ) : null}
            {uploadedImageUrl ? (
              <p className="break-all text-xs font-semibold text-zinc-500">Cloudinary URL: {uploadedImageUrl}</p>
            ) : null}
          </div>
          <Textarea className="sm:col-span-2" placeholder="Description" {...form.register("description")} />
          <Textarea className="sm:col-span-2" placeholder="Specifications notes" {...form.register("specifications")} />
        </div>
        <div className="text-sm font-semibold text-red-700">{Object.values(form.formState.errors)[0]?.message ?? createGear.error?.message}</div>
        <Button className="w-full" disabled={createGear.isPending || isUploadingImage}>
          {isUploadingImage ? "Uploading image..." : createGear.isPending ? "Saving..." : "Create Gear"}
        </Button>
      </form>
    </Card>
  );
}
