import { UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  usersCount: number;
  gearCount: number;
  rentalCount: number;
};

export function AdminStats({ usersCount, gearCount, rentalCount }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-5"><UsersRound className="mb-3 text-teal-700" /><p className="text-sm text-zinc-500">Users</p><strong className="text-3xl">{usersCount}</strong></Card>
      <Card className="p-5"><p className="text-sm text-zinc-500">Gear</p><strong className="text-3xl">{gearCount}</strong></Card>
      <Card className="p-5"><p className="text-sm text-zinc-500">Rentals</p><strong className="text-3xl">{rentalCount}</strong></Card>
    </div>
  );
}
