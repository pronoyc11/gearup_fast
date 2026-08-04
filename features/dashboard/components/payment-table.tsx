import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import type { Payment } from "@/features/payment/types/payment.types";
import { money } from "@/lib/ui";

export function PaymentTable({ payments }: { payments?: Payment[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-zinc-200 p-4"><h2 className="font-black">Payments</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>{payments?.map((payment) => (
            <tr key={payment.id} className="border-b border-zinc-100">
              <td className="p-4 font-semibold">{payment.id.slice(0, 8)}</td>
              <td className="p-4">{money(payment.amount)}</td>
              <td className="p-4"><StatusBadge value={payment.status} /></td>
              <td className="p-4">{payment.provider}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Card>
  );
}
