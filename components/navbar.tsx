"use client";

import { Button } from "@/components/ui/button";
import { Bike, LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardPath, useAuthStore } from "@/stores/auth.store";

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-600 text-white">
            <Bike size={20} />
          </span>
          GearUp
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
          <Button asChild variant="ghost"><Link href="/gear">Gear</Link></Button>
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
