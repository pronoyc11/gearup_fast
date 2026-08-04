"use client";

import { clearAuth, dashboardFor, storedUser } from "@/lib/auth";
import { Bike, LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();
  const user = storedUser();

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
          <Link className="rounded-md px-3 py-2 hover:bg-zinc-100" href="/gear">
            Gear
          </Link>
          {user ? (
            <>
              <Link className="hidden rounded-md px-3 py-2 hover:bg-zinc-100 sm:block" href="/account">
                Account
              </Link>
              <Link
                className="flex items-center gap-1 rounded-md px-3 py-2 hover:bg-zinc-100"
                href={dashboardFor(user.role)}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button
                className="flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-2 text-white hover:bg-zinc-700"
                onClick={() => {
                  clearAuth();
                  router.push("/");
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link className="hidden rounded-md px-3 py-2 hover:bg-zinc-100 sm:block" href="/auth/register">
                <UserRound size={16} className="mr-1 inline" />
                Register
              </Link>
              <Link className="flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-2 text-white" href="/auth/login">
                <LogIn size={16} /> Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
