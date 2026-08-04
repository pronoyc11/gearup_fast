"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateRental } from "../hooks/use-rentals";
import { createRentalSchema, type CreateRentalFormValues } from "../schemas/rental.schemas";

type Props = {
  gearId: string;
  maxQuantity: number;
  disabled?: boolean;
};

export function CreateRentalForm({ gearId, maxQuantity, disabled }: Props) {
  const router = useRouter();
  const createRental = useCreateRental();
  const form = useForm<CreateRentalFormValues>({
    resolver: zodResolver(createRentalSchema),
    defaultValues: { startDate: "", endDate: "", quantity: 1 },
  });

  async function onSubmit(values: CreateRentalFormValues) {
    const order = await createRental.mutateAsync({
      startDate: values.startDate,
      endDate: values.endDate,
      items: [{ gearId, quantity: values.quantity }],
    });

    router.push(`/dashboard/customer/orders/${order.id}/pay`);
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
        <Button className="w-full" disabled={disabled || createRental.isPending}>
          {createRental.isPending ? "Creating order..." : "Create Rental Order"}
        </Button>
      </form>
    </Card>
  );
}
