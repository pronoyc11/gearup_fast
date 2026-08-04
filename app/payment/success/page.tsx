import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-66px)] max-w-lg content-center px-4 py-10 text-center">
      <section className="panel p-8">
        <CheckCircle2 className="mx-auto mb-4 text-emerald-600" size={48} />
        <h1 className="text-2xl font-black">Payment Successful</h1>
        <p className="mt-2 text-zinc-600">Your rental payment is being confirmed by Stripe.</p>
        <Link className="btn btn-primary mt-6" href="/dashboard/customer">View Orders</Link>
      </section>
    </main>
  );
}
