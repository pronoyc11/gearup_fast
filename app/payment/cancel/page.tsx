import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-66px)] max-w-lg content-center px-4 py-10 text-center">
      <section className="panel p-8">
        <XCircle className="mx-auto mb-4 text-red-600" size={48} />
        <h1 className="text-2xl font-black">Payment Cancelled</h1>
        <p className="mt-2 text-zinc-600">No charge was completed. You can retry from your dashboard.</p>
        <Link className="btn btn-primary mt-6" href="/dashboard/customer">Back to Dashboard</Link>
      </section>
    </main>
  );
}
