"use client";

import { ShoppingCart } from "lucide-react";
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
  const showToast = useToastStore((state) => state.showToast);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";

  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full"
      disabled={isAdmin || gear.availability !== "AVAILABLE" || gear.stock <= 0}
      onClick={() => {
        if (isAdmin) {
          showToast({ title: "Admin action unavailable", description: "Admins can inspect gear, but they cannot create rentals.", variant: "info" });
          return;
        }

        addGear(gear);
        showToast({ title: "Added to cart", description: gear.title, variant: "success" });
      }}
    >
      <ShoppingCart size={18} /> {isAdmin ? "Unavailable for Admins" : "Add to Cart"}
    </Button>
  );
}
