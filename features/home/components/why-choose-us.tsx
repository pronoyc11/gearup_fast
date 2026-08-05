import { CreditCard, PackageSearch, ShieldCheck, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";

const reasons = [
  { icon: PackageSearch, title: "Curated Gear", description: "Browse practical sports and outdoor equipment with stock, price, and availability clearly visible." },
  { icon: Truck, title: "Provider Fulfillment", description: "Each provider manages their own order items, so rentals move through the right workflow." },
  { icon: CreditCard, title: "Secure Checkout", description: "Confirmed rental orders can be paid through the backend Stripe checkout flow." },
  { icon: ShieldCheck, title: "Role Protection", description: "Customer, provider, and admin dashboards stay separated with protected routing." },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black">Why Choose GearUp</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Built for renters, providers, and admins who need the same system to feel simple.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="p-5">
            <Icon className="mb-4 text-teal-700" size={26} />
            <h3 className="font-black">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
