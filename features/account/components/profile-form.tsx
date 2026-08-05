"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useAuthStore } from "@/stores/auth.store";
import { useToastStore } from "@/stores/toast.store";
import { useDeleteProfile, useUpdateProfile } from "../hooks/use-account";
import { updateProfileSchema, type UpdateProfileFormValues } from "../schemas/account.schemas";

export function ProfileForm() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const setAuth = useAuthStore((state) => state.setAuth);
  const showToast = useToastStore((state) => state.showToast);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: user } = useCurrentUser(Boolean(accessToken));
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
      showToast({ title: "Profile updated", variant: "success" });
    } catch (error) {
      showToast({ title: "Could not update profile", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    }
  }

  async function handleDelete() {
    try {
      await deleteProfile.mutateAsync();
      logout();
      showToast({ title: "Profile deleted", variant: "success" });
      router.push("/");
    } catch (error) {
      showToast({ title: "Could not delete profile", description: error instanceof Error ? error.message : "Please try again.", variant: "error" });
    }
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center gap-2"><UserRound className="text-teal-700" /><h1 className="text-2xl font-black">Account</h1></div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Name" {...form.register("name")} />
        <Input value={user?.email ?? ""} readOnly />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Phone" {...form.register("phone")} />
          <Input value={user?.role ?? ""} readOnly />
        </div>
        <Textarea placeholder="Address" {...form.register("address")} />
        <div className="text-sm font-semibold text-red-700">{form.formState.errors.name?.message ?? updateProfile.error?.message ?? deleteProfile.error?.message}</div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={updateProfile.isPending}>Save Profile</Button>
          <Button variant="destructive" type="button" onClick={handleDelete} disabled={deleteProfile.isPending}>Delete Profile</Button>
        </div>
      </form>
    </Card>
  );
}
