import Image from "next/image";
import { Card } from "@/components/ui/card";

const stats = [
  ["3", "Role dashboards"],
  ["Multi", "Provider orders"],
  ["Stripe", "Payment flow"],
];

export function AboutContent() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-5">
          <p className="text-sm font-bold uppercase tracking-widest text-teal-700">About GearUp</p>
          <h1 className="text-4xl font-black leading-tight">A rental marketplace for sports and outdoor equipment.</h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            GearUp connects customers with providers who rent gear for matches, training, events, and outdoor trips. The frontend consumes the existing REST API and separates customer, provider, and admin workflows.
          </p>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-lg">
          <Image
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop"
            alt="Sports gear on a field"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 sm:px-6 md:grid-cols-3">
        {stats.map(([value, label]) => (
          <Card key={label} className="p-5">
            <strong className="text-3xl text-teal-700">{value}</strong>
            <p className="mt-2 font-semibold text-zinc-600 dark:text-zinc-400">{label}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
