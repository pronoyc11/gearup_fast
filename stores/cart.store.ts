"use client";

import { create } from "zustand";
import type { Gear } from "@/features/gear/types/gear.types";
import type { CartItem } from "@/features/cart/types/cart.types";

type CartState = {
  items: CartItem[];
  addGear: (gear: Gear, quantity?: number) => void;
  removeItem: (gearId: string) => void;
  updateQuantity: (gearId: string, quantity: number) => void;
  clearSelected: (gearIds: string[]) => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addGear: (gear, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.gearId === gear.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.gearId === gear.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, gear.stock) }
              : item,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            gearId: gear.id,
            title: gear.title,
            brand: gear.brand,
            image: gear.image,
            pricePerDay: gear.pricePerDay,
            stock: gear.stock,
            quantity: Math.min(quantity, gear.stock),
          },
        ],
      };
    });
  },
  removeItem: (gearId) => {
    set((state) => ({ items: state.items.filter((item) => item.gearId !== gearId) }));
  },
  updateQuantity: (gearId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.gearId === gearId ? { ...item, quantity: Math.min(Math.max(quantity, 1), item.stock) } : item,
      ),
    }));
  },
  clearSelected: (gearIds) => {
    set((state) => ({ items: state.items.filter((item) => !gearIds.includes(item.gearId)) }));
  },
}));
