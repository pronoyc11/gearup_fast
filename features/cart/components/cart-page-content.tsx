"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateRental } from "@/features/rental/hooks/use-rentals";
import { fallbackGearImage } from "@/shared/utils/assets";
import { formatMoney } from "@/shared/utils/format";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { useToastStore } from "@/stores/toast.store";
import { cartCheckoutSchema, type CartCheckoutFormValues } from "../schemas/cart.schemas";

export function CartPageContent() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearSelected = useCartStore((state) => state.clearSelected);
  const showToast = useToastStore((state) => state.showToast);
  const createRental = useCreateRental();
  const [selectedGearIds, setSelectedGearIds] = useState<string[]>(items.map((item) => item.gearId));
  const form = useForm<CartCheckoutFormValues>({
    resolver: zodResolver(cartCheckoutSchema),
    defaultValues: { startDate: "", endDate: "" },
  });

  const selectedItems = items.filter((item) => selectedGearIds.includes(item.gearId));
  const selectedTotal = selectedItems.reduce((sum, item) => sum + Number(item.pricePerDay) * item.quantity, 0);

  function toggleSelection(gearId: string) {
    setSelectedGearIds((current) =>
      current.includes(gearId) ? current.filter((id) => id !== gearId) : [...current, gearId],
    );
  }

  async function onSubmit(values: CartCheckoutFormValues) {
    if (!user) {
      showToast({ title: "Login required", description: "Please login before placing a cart order.", variant: "info" });
      router.push("/auth/login");
      return;
    }

    if (selectedItems.length === 0) {
      showToast({ title: "No items selected", description: "Select at least one gear item for the order.", variant: "error" });
      return;
    }

    try {
      await createRental.mutateAsync({
        startDate: values.startDate,
        endDate: values.endDate,
        items: selectedItems.map((item) => ({ gearId: item.gearId, quantity: item.quantity })),
      });
      clearSelected(selectedItems.map((item) => item.gearId));
      showToast({
        title: "Rental order placed",
        description: "You can pay each item as soon as its provider confirms it.",
        variant: "success",
      });
      router.push("/dashboard/customer");
    } catch (error) {
      showToast({ title: "Could not place order", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    }
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-black">Cart</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Select the gear items you want to include in one rental order.</p>
      </header>

      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-black">Your cart is empty</h2>
          <Button asChild className="mt-5"><Link href="/gear">Browse Gear</Link></Button>
        </Card>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-3">
            {items.map((item) => (
              <Card key={item.gearId} className="grid gap-4 p-4 sm:grid-cols-[auto_96px_1fr_auto] sm:items-center">
                <input
                  type="checkbox"
                  checked={selectedGearIds.includes(item.gearId)}
                  onChange={() => toggleSelection(item.gearId)}
                  className="h-5 w-5"
                />
                <div className="relative h-24 w-24 overflow-hidden rounded-md bg-zinc-100">
                  <Image src={item.image || fallbackGearImage} alt={item.title} fill className="object-cover" sizes="96px" />
                </div>
                <div>
                  <Link href={`/gear/${item.gearId}`} className="font-black hover:text-teal-700">{item.title}</Link>
                  <p className="text-sm text-zinc-500">{item.brand} | {formatMoney(item.pricePerDay)}/day</p>
                  <Input
                    type="number"
                    min={1}
                    max={item.stock}
                    value={item.quantity}
                    className="mt-3 max-w-28"
                    onChange={(event) => updateQuantity(item.gearId, Number(event.target.value))}
                  />
                </div>
                <Button type="button" variant="destructive" onClick={() => removeItem(item.gearId)}>Remove</Button>
              </Card>
            ))}
          </section>

          <Card className="h-fit space-y-4 p-5">
            <h2 className="text-xl font-black">Place Order</h2>
            <Input type="date" min={new Date().toISOString().slice(0, 10)} {...form.register("startDate")} />
            <Input type="date" min={new Date().toISOString().slice(0, 10)} {...form.register("endDate")} />
            <div className="text-sm font-semibold text-red-700">{Object.values(form.formState.errors)[0]?.message}</div>
            <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Selected items</p>
              <strong>{selectedItems.length}</strong>
              <p className="mt-2 text-sm text-zinc-500">Estimated daily total</p>
              <strong>{formatMoney(selectedTotal)}</strong>
            </div>
            <Button className="w-full" disabled={createRental.isPending}>
              {createRental.isPending ? "Placing order..." : "Place Rental Order"}
            </Button>
          </Card>
        </form>
      )}
    </main>
  );
}
