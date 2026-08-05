"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { useCreateRental } from "../hooks/use-rentals";
import { createRentalSchema, type CreateRentalFormValues } from "../schemas/rental.schemas";

type Props = {
  gearId: string;
  maxQuantity: number;
  disabled?: boolean;
};

export function CreateRentalForm({ gearId, maxQuantity, disabled }: Props) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const showToast = useToastStore((state) => state.showToast);
  const createRental = useCreateRental();
  const isAdmin = user?.role === "ADMIN";
  const form = useForm<CreateRentalFormValues>({
    resolver: zodResolver(createRentalSchema),
    defaultValues: { startDate: "", endDate: "", quantity: 1 },
  });

  async function onSubmit(values: CreateRentalFormValues) {
    if (!user) {
      showToast({ title: "Login required", description: "Please login or create an account before creating a rental order.", variant: "info" });
      router.push("/auth/login");
      return;
    }

    if (isAdmin) {
      showToast({ title: "Admin action unavailable", description: "Admins can inspect rentals, but they cannot create customer rental orders.", variant: "info" });
      return;
    }

    try {
      await createRental.mutateAsync({
        startDate: values.startDate,
        endDate: values.endDate,
        items: [{ gearId, quantity: values.quantity }],
      });
      showToast({
        title: "Rental order created",
        description: "You can pay as soon as the provider confirms the item.",
        variant: "success",
      });
      router.push("/dashboard/customer");
    } catch (error) {
      showToast({ title: "Could not create rental", description: error instanceof Error ? error.message : "Please check dates and stock.", variant: "error" });
    }
  }

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center gap-2 font-black">
        <CalendarCheck size={20} /> Rent Now
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input type="date" min={new Date().toISOString().slice(0, 10)} {...form.register("startDate")} />
          <Input type="date" min={new Date().toISOString().slice(0, 10)} {...form.register("endDate")} />
          <Input type="number" min={1} max={maxQuantity} {...form.register("quantity", { valueAsNumber: true })} />
        </div>
        <div className="text-sm font-semibold text-red-700">
          {Object.values(form.formState.errors)[0]?.message ?? createRental.error?.message}
        </div>
        {isAdmin ? (
          <p className="text-sm font-semibold text-amber-700">Admins cannot create rental orders.</p>
        ) : null}
        <Button className="w-full" disabled={disabled || createRental.isPending || isAdmin}>
          {isAdmin ? "Unavailable for Admins" : createRental.isPending ? "Creating order..." : "Create Rental Order"}
        </Button>
      </form>
    </Card>
  );
}
