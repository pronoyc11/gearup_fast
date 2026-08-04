import { ArrowRight, CalendarDays, LucideIcon, ShieldCheck, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const highlights: [LucideIcon, string][] = [
  [SlidersHorizontal, "Filtered catalog"],
  [CalendarDays, "Date-based orders"],
  [ShieldCheck, "Role dashboards"],
];

export function HeroSection() {
  return (
    <section className="bg-[linear-gradient(90deg,rgba(15,118,110,.92),rgba(24,24,27,.72)),url('https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center">
      <div className="mx-auto grid min-h-[560px] max-w-7xl content-center gap-8 px-4 py-16 text-white sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-100">Rent sports and outdoor gear instantly</p>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">GearUp</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-100">
            Browse trusted equipment, reserve rental dates, pay securely, and track every order from pickup to return.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="secondary"><Link href="/gear">Browse Gear <ArrowRight size={18} /></Link></Button>
            <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10"><Link href="/auth/register">Start Renting</Link></Button>
          </div>
        </div>
        <div className="grid content-end gap-3 text-sm sm:grid-cols-3 lg:mt-24">
          {highlights.map(([Icon, label]) => (
            <div key={label} className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
              <Icon className="mb-3" size={22} />
              <p className="font-bold">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
