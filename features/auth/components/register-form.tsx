"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useRegister } from "../hooks/use-register";
import { registerSchema, type RegisterFormValues } from "../schemas/auth.schemas";
import { useToastStore } from "@/stores/toast.store";

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useRegister();
  const showToast = useToastStore((state) => state.showToast);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "CUSTOMER", phone: "", address: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser.mutateAsync(values);
      showToast({ title: "Registration successful", description: "You can now login.", variant: "success" });
      router.push("/auth/login");
    } catch (error) {
      showToast({ title: "Registration failed", description: error instanceof Error ? error.message : "Please check your details.", variant: "error" });
    }
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2">
        <UserPlus className="text-teal-700" />
        <h1 className="text-2xl font-black">Create Account</h1>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Full name" {...form.register("name")} />
          <Input type="email" placeholder="Email" {...form.register("email")} />
          <Input type="password" placeholder="Password" {...form.register("password")} />
          <Select {...form.register("role")}>
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
          </Select>
          <Input placeholder="Phone" {...form.register("phone")} />
          <Input placeholder="Address" {...form.register("address")} />
        </div>
        <div className="text-sm font-semibold text-red-700">
          {Object.values(form.formState.errors)[0]?.message}
        </div>
        {registerUser.error ? <p className="text-sm font-semibold text-red-700">{registerUser.error.message}</p> : null}
        <Button className="w-full" disabled={registerUser.isPending}>{registerUser.isPending ? "Creating..." : "Register"}</Button>
      </form>
      <p className="text-center text-sm text-zinc-600">
        Already registered? <Link className="font-bold text-teal-700" href="/auth/login">Login</Link>
      </p>
    </Card>
  );
}
