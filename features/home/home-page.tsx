"use client";

import { GearCard } from "@/components/gear-card";
import { api, listOf } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, LucideIcon, ShieldCheck, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-gear"],
    queryFn: () => api.gear({ availability: "AVAILABLE", limit: 6, sortBy: "createdAt", sortOrder: "desc" }),
  });
  const gear = listOf(data);

  return (
    <main>
      <section className="bg-[linear-gradient(90deg,rgba(15,118,110,.92),rgba(24,24,27,.72)),url('https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center">
        <div className="mx-auto grid min-h-[560px] max-w-7xl content-center gap-8 px-4 py-16 text-white sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-100">Rent sports and outdoor gear instantly</p>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">GearUp</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-100">
              Browse trusted equipment, reserve rental dates, pay securely, and track every order from pickup to return.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/gear" className="btn bg-white text-zinc-950 hover:bg-zinc-100">
                Browse Gear <ArrowRight size={18} />
              </Link>
              <Link href="/auth/register" className="btn border border-white/40 text-white hover:bg-white/10">
                Start Renting
              </Link>
            </div>
          </div>
          <div className="grid content-end gap-3 text-sm sm:grid-cols-3 lg:mt-24">
            {([
              [SlidersHorizontal, "Filtered catalog"],
              [CalendarDays, "Date-based orders"],
              [ShieldCheck, "Role dashboards"],
            ] as [LucideIcon, string][]).map(([Icon, label]) => (
              <div key={String(label)} className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
                <Icon className="mb-3" size={22} />
                <p className="font-bold">{String(label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Featured Gear</h2>
            <p className="text-zinc-600">Fresh equipment ready for your next match, hike, or training session.</p>
          </div>
          <Link href="/gear" className="btn btn-ghost">View all</Link>
        </div>
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-lg bg-zinc-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{gear.map((item) => <GearCard key={item.id} gear={item} />)}</div>
        )}
      </section>
    </main>
  );
}
