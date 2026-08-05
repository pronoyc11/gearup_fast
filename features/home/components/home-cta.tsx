import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeCta() {
  return (
    <section className="bg-teal-700 text-white dark:bg-teal-900">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-12 sm:px-6 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-3xl font-black">Ready for your next game or trip?</h2>
          <p className="mt-2 max-w-2xl text-teal-50">Create an account, reserve available gear, and manage everything from one role-aware dashboard.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary"><Link href="/gear">Browse Gear</Link></Button>
          <Button asChild variant="outline" className="border-white/40 text-white hover:bg-white/10"><Link href="/auth/register">Create Account</Link></Button>
        </div>
      </div>
    </section>
  );
}
