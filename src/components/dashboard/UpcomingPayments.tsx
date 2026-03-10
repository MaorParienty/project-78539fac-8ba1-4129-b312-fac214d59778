import { Payment } from "@/context/FinanceContext";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface Props {
  payments: Payment[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function UpcomingPayments({ payments }: Props) {
  const sorted = [...payments].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Upcoming Payments</h3>
      <div className="space-y-0">
        {sorted.map((p) => (
          <div key={p.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.type} · {format(new Date(p.dueDate), "MMM d")}</p>
              </div>
            </div>
            <span className="font-heading text-sm font-semibold text-chart-expense">
              {fmt(p.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
