"use client";

import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Gear } from "@/features/gear/types/gear.types";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { useToastStore } from "@/stores/toast.store";

type Props = {
  gear: Gear;
};

export function AddToCartButton({ gear }: Props) {
  const addGear = useCartStore((state) => state.addGear);
  const isAlreadyInCart = useCartStore((state) => state.items.some((item) => item.gearId === gear.id));
  const showToast = useToastStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);
  const cannotCreateRental = user?.role === "ADMIN" || user?.role === "PROVIDER";
  const isUnavailable = gear.availability !== "AVAILABLE" || gear.stock <= 0;

  return (
    <Button
      type="button"
      variant={isAlreadyInCart ? "default" : "secondary"}
      className="w-full"
      disabled={cannotCreateRental || isUnavailable || isAlreadyInCart}
      onClick={() => {
        if (cannotCreateRental) {
          showToast({ title: "Action unavailable", description: "Only customers can create rental orders.", variant: "info" });
          return;
        }

        if (isAlreadyInCart) {
          showToast({ title: "Already in cart", description: gear.title, variant: "info" });
          return;
        }

        addGear(gear);
        showToast({ title: "Added to cart", description: gear.title, variant: "success" });
      }}
    >
      {isAlreadyInCart ? <Check size={18} /> : <ShoppingCart size={18} />}
      {cannotCreateRental ? "Customers Only" : isUnavailable ? "Unavailable" : isAlreadyInCart ? "Already Added to Cart" : "Add to Cart"}
    </Button>
  );
}
