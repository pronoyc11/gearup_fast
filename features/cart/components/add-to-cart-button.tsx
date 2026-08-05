"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Gear } from "@/features/gear/types/gear.types";
import { useCartStore } from "@/stores/cart.store";
import { useToastStore } from "@/stores/toast.store";

type Props = {
  gear: Gear;
};

export function AddToCartButton({ gear }: Props) {
  const addGear = useCartStore((state) => state.addGear);
  const showToast = useToastStore((state) => state.showToast);

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full"
      disabled={gear.availability !== "AVAILABLE" || gear.stock <= 0}
      onClick={() => {
        addGear(gear);
        showToast({ title: "Added to cart", description: gear.title, variant: "success" });
      }}
    >
      <ShoppingCart size={18} /> Add to Cart
    </Button>
  );
}
