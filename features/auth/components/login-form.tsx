"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore, dashboardPath } from "@/stores/auth.store";
import { authApi } from "../api/auth.api";
import { useLogin } from "../hooks/use-login";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schemas";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const login = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    const result = await login.mutateAsync(values);
    const user = result.user ?? (await authApi.me());
    setAuth(result.accessToken, user);
    router.push(dashboardPath(user.role));
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2">
        <LockKeyhole className="text-teal-700" />
        <h1 className="text-2xl font-black">Login</h1>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input type="email" placeholder="Email" {...form.register("email")} />
          <p className="mt-1 text-sm font-semibold text-red-700">{form.formState.errors.email?.message}</p>
        </div>
        <div>
          <Input type="password" placeholder="Password" {...form.register("password")} />
          <p className="mt-1 text-sm font-semibold text-red-700">{form.formState.errors.password?.message}</p>
        </div>
        {login.error ? <p className="text-sm font-semibold text-red-700">{login.error.message}</p> : null}
        <Button className="w-full" disabled={login.isPending}>{login.isPending ? "Signing in..." : "Sign in"}</Button>
      </form>
      <p className="text-center text-sm text-zinc-600">
        New here? <Link className="font-bold text-teal-700" href="/auth/register">Create an account</Link>
      </p>
    </Card>
  );
}
