"use client";

import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const register = useMutation({
    mutationFn: api.register,
    onSuccess: () => router.push("/auth/login"),
    onError: (err) => setError(err.message),
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    register.mutate({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
      role: form.get("role") as "CUSTOMER" | "PROVIDER",
      phone: String(form.get("phone") || ""),
      address: String(form.get("address") || ""),
    });
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-66px)] max-w-xl content-center px-4 py-10">
      <form onSubmit={submit} className="panel space-y-4 p-6">
        <div className="flex items-center gap-2"><UserPlus className="text-teal-700" /><h1 className="text-2xl font-black">Create Account</h1></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input required className="input" name="name" placeholder="Full name" />
          <input required className="input" name="email" type="email" placeholder="Email" />
          <input required className="input" name="password" type="password" placeholder="Password" />
          <select className="input" name="role" defaultValue="CUSTOMER">
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
          </select>
          <input className="input" name="phone" placeholder="Phone" />
          <input className="input" name="address" placeholder="Address" />
        </div>
        {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
        <button className="btn btn-primary w-full" disabled={register.isPending}>{register.isPending ? "Creating..." : "Register"}</button>
        <p className="text-center text-sm text-zinc-600">Already registered? <Link className="font-bold text-teal-700" href="/auth/login">Login</Link></p>
      </form>
    </main>
  );
}
