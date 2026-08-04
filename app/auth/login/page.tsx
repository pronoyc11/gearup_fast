"use client";

import { api } from "@/lib/api";
import { dashboardFor, persistAuth } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const login = useMutation({
    mutationFn: api.login,
    onSuccess: async (data) => {
      let user = data.user;
      persistAuth(data.accessToken, user);
      if (!user) user = await api.me();
      persistAuth(data.accessToken, user);
      router.push(dashboardFor(user.role));
    },
    onError: (err) => setError(err.message),
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    login.mutate({ email: String(form.get("email")), password: String(form.get("password")) });
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-66px)] max-w-md content-center px-4 py-10">
      <form onSubmit={submit} className="panel space-y-4 p-6">
        <div className="flex items-center gap-2"><LockKeyhole className="text-teal-700" /><h1 className="text-2xl font-black">Login</h1></div>
        <input required className="input" name="email" type="email" placeholder="Email" />
        <input required className="input" name="password" type="password" placeholder="Password" />
        {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
        <button className="btn btn-primary w-full" disabled={login.isPending}>{login.isPending ? "Signing in..." : "Sign in"}</button>
        <p className="text-center text-sm text-zinc-600">New here? <Link className="font-bold text-teal-700" href="/auth/register">Create an account</Link></p>
      </form>
    </main>
  );
}
