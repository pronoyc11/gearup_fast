"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bike, LayoutDashboard, LogIn, LogOut, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardPath, useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartStore((state) => state.items.length);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-600 text-white">
            <Bike size={20} />
          </span>
          GearUp
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          <Button asChild variant="ghost"><Link href="/gear">Gear</Link></Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link href="/about">About</Link></Button>
          <Button asChild variant="ghost">
            <Link href="/cart"><ShoppingCart size={16} /> Cart{cartCount ? ` (${cartCount})` : ""}</Link>
          </Button>
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link href="/account">Account</Link></Button>
              <Button asChild variant="ghost">
                <Link href={dashboardPath(user.role)}><LayoutDashboard size={16} /> Dashboard</Link>
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link href="/auth/register"><UserRound size={16} /> Register</Link></Button>
              <Button asChild><Link href="/auth/login"><LogIn size={16} /> Login</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
