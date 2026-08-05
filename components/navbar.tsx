"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bike, LayoutDashboard, LogIn, LogOut, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { dashboardPath, useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const cartCount = useCartStore((state) => state.items.length);
  const cartLabel = cartCount ? `Cart (${cartCount})` : "Cart";

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    router.push("/");
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-600 text-white">
            <Bike size={20} />
          </span>
          GearUp
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 md:flex">
          <Button asChild variant="ghost"><Link href="/gear">Gear</Link></Button>
          <Button asChild variant="ghost"><Link href="/about">About</Link></Button>
          <Button asChild variant="ghost">
            <Link href="/cart"><ShoppingCart size={16} /> {cartLabel}</Link>
          </Button>
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost"><Link href="/account">Account</Link></Button>
              <Button asChild variant="ghost">
                <Link href={dashboardPath(user.role)}><LayoutDashboard size={16} /> Dashboard</Link>
              </Button>
              <Button variant="default" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/auth/register"><UserRound size={16} /> Register</Link></Button>
              <Button asChild><Link href="/auth/login"><LogIn size={16} /> Login</Link></Button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            <Button asChild variant="ghost" className="justify-start">
              <Link href="/gear" onClick={closeMenu}>Gear</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start">
              <Link href="/about" onClick={closeMenu}>About</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start">
              <Link href="/cart" onClick={closeMenu}><ShoppingCart size={16} /> {cartLabel}</Link>
            </Button>
            {user ? (
              <>
                <Button asChild variant="ghost" className="justify-start">
                  <Link href="/account" onClick={closeMenu}>Account</Link>
                </Button>
                <Button asChild variant="ghost" className="justify-start">
                  <Link href={dashboardPath(user.role)} onClick={closeMenu}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                </Button>
                <Button className="justify-start" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="justify-start">
                  <Link href="/auth/register" onClick={closeMenu}><UserRound size={16} /> Register</Link>
                </Button>
                <Button asChild className="justify-start">
                  <Link href="/auth/login" onClick={closeMenu}><LogIn size={16} /> Login</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
