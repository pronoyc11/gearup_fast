"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { useDeleteProfile, useProfile, useUpdateProfile } from "../hooks/use-account";
import { updateProfileSchema, type UpdateProfileFormValues } from "../schemas/account.schemas";

function friendlyError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function friendlyDeleteError(error: unknown) {
  if (!error) return "";

  const message = error instanceof Error ? error.message : "";

  if (message.includes("Foreign key constraint") || message.includes("rentalOrders_customerId_fkey")) {
    return "Your profile cannot be deleted yet because it is connected to existing rental orders. Please contact support if you need the account removed.";
  }

  return friendlyError(error, "We could not delete your profile right now. Please try again in a moment.");
}

function formatDate(value?: string) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export function ProfileForm() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const setAuth = useAuthStore((state) => state.setAuth);
  const showToast = useToastStore((state) => state.showToast);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: user, error: profileError, isLoading } = useProfile(Boolean(accessToken));
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: "", phone: "", address: "" },
  });

  useEffect(() => {
    if (user) form.reset({ name: user.name, phone: user.phone ?? "", address: user.address ?? "" });
  }, [form, user]);

  async function onSubmit(values: UpdateProfileFormValues) {
    try {
      const updatedUser = await updateProfile.mutateAsync(values);
      if (accessToken) setAuth(accessToken, updatedUser);
      showToast({ title: "Profile updated", description: "Your account details have been saved.", variant: "success" });
    } catch (error) {
      showToast({
        title: "Could not update profile",
        description: friendlyError(error, "Please check your details and try again."),
        variant: "error",
      });
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete your profile permanently? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteProfile.mutateAsync();
      logout();
      showToast({ title: "Profile deleted", variant: "success" });
      router.push("/");
    } catch (error) {
      showToast({
        title: "Could not delete profile",
        description: friendlyDeleteError(error),
        variant: "error",
      });
    }
  }

  if (!accessToken) {
    return (
      <Card className="space-y-4 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-amber-700" />
          <h1 className="text-2xl font-black">Login required</h1>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">Please login to view and manage your profile.</p>
        <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
      </Card>
    );
  }

  if (isLoading) {
    return <Card className="p-6">Loading your profile...</Card>;
  }

  if (profileError) {
    return (
      <Card className="space-y-4 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-700" />
          <h1 className="text-2xl font-black">Could not load profile</h1>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          {friendlyError(profileError, "We could not fetch your profile right now. Please refresh or try again later.")}
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserRound className="text-teal-700" />
          <h1 className="text-2xl font-black">Account</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{user?.role ?? "USER"}</Badge>
          <Badge variant={user?.status === "SUSPENDED" ? "danger" : "success"}>
            {user?.status ?? "ACTIVE"}
          </Badge>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">User ID</p>
          <strong className="break-all">{user?.id ?? "Not available"}</strong>
        </div>
        <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Email</p>
          <strong className="break-all">{user?.email ?? "Not available"}</strong>
        </div>
        <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Phone</p>
          <strong>{user?.phone || "Not provided"}</strong>
        </div>
        <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Joined</p>
          <strong>{formatDate(user?.createdAt)}</strong>
        </div>
        <div className="rounded-md bg-zinc-50 p-4 dark:bg-zinc-900 sm:col-span-2">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Address</p>
          <strong>{user?.address || "Not provided"}</strong>
        </div>
      </section>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2 font-black">
          <ShieldCheck size={18} className="text-teal-700" />
          Update Profile
        </div>
        <Input placeholder="Name" {...form.register("name")} />
        <Input value={user?.email ?? ""} readOnly />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Phone" {...form.register("phone")} />
          <Input value={user?.role ?? ""} readOnly />
        </div>
        <Textarea placeholder="Address" {...form.register("address")} />
        <div className="text-sm font-semibold text-red-700">
          {form.formState.errors.name?.message ??
            friendlyError(updateProfile.error, "") ??
            friendlyDeleteError(deleteProfile.error)}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Saving..." : "Save Profile"}
          </Button>
          <Button variant="destructive" type="button" onClick={handleDelete} disabled={deleteProfile.isPending}>
            <Trash2 size={16} /> {deleteProfile.isPending ? "Deleting..." : "Delete Profile"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
