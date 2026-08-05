import { Mail, Phone, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Gear } from "../types/gear.types";

type Props = {
  gear: Gear;
};

export function ProviderInfoCard({ gear }: Props) {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2 font-black">
        <UserRound size={18} /> Provider Profile
      </div>
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Name</p>
        <strong>{gear.provider?.name ?? gear.providerId ?? "Provider information unavailable"}</strong>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400"><Mail size={14} /> Email</p>
          <strong>{gear.provider?.email ?? "Not available"}</strong>
        </div>
        <div>
          <p className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400"><Phone size={14} /> Phone</p>
          <strong>{gear.provider?.phone ?? "Not available"}</strong>
        </div>
      </div>
      {gear.provider?.address ? (
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Address</p>
          <strong>{gear.provider.address}</strong>
        </div>
      ) : null}
    </Card>
  );
}
