"use client";

import { api } from "@/lib/api";
import { clearAuth, persistAuth } from "@/lib/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const { data: user, refetch } = useQuery({ queryKey: ["me"], queryFn: api.me });
  const update = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: async () => {
      const fresh = await refetch();
      const token = localStorage.getItem("gearup_token");
      if (token && fresh.data) persistAuth(token, fresh.data);
      setMessage("Profile updated.");
    },
    onError: (err) => setMessage(err.message),
  });
  const remove = useMutation({
    mutationFn: api.deleteProfile,
    onSuccess: () => {
      clearAuth();
      router.push("/");
    },
    onError: (err) => setMessage(err.message),
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    update.mutate({ name: String(f.get("name")), phone: String(f.get("phone") || ""), address: String(f.get("address") || "") });
  }

  return (
    <main className="mx-auto grid max-w-2xl px-4 py-8 sm:px-6">
      <form onSubmit={submit} className="panel space-y-4 p-6">
        <div className="flex items-center gap-2"><UserRound className="text-teal-700" /><h1 className="text-2xl font-black">Account</h1></div>
        <input className="input" name="name" defaultValue={user?.name ?? ""} placeholder="Name" />
        <input className="input" value={user?.email ?? ""} readOnly />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" name="phone" defaultValue={user?.phone ?? ""} placeholder="Phone" />
          <input className="input" value={user?.role ?? ""} readOnly />
        </div>
        <textarea className="input" name="address" defaultValue={user?.address ?? ""} placeholder="Address" rows={3} />
        {message ? <p className="text-sm font-semibold text-teal-800">{message}</p> : null}
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" disabled={update.isPending}>Save Profile</button>
          <button className="btn btn-ghost text-red-700" type="button" onClick={() => remove.mutate()}>Delete Profile</button>
        </div>
      </form>
    </main>
  );
}
