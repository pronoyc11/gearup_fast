import { UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  usersCount: number;
  activeGearCount: number;
  rentalCount: number;
};

export function AdminStats({ usersCount, activeGearCount, rentalCount }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-5"><UsersRound className="mb-3 text-teal-700" /><p className="text-sm text-zinc-500">Total Users</p><strong className="text-3xl">{usersCount}</strong></Card>
      <Card className="p-5"><p className="text-sm text-zinc-500">Active Gear</p><strong className="text-3xl">{activeGearCount}</strong></Card>
      <Card className="p-5"><p className="text-sm text-zinc-500">Total Rentals</p><strong className="text-3xl">{rentalCount}</strong></Card>
    </div>
  );
}
