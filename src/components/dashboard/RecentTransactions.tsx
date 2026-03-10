import { Transaction } from "@/context/FinanceContext";
import { format } from "date-fns";

interface Props {
  transactions: Transaction[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function RecentTransactions({ transactions }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Recent Transactions</h3>
      <div className="space-y-0">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{t.notes || t.category}</p>
              <p className="text-xs text-muted-foreground">{t.category} · {format(new Date(t.date), "MMM d")}</p>
            </div>
            <span className={`font-heading text-sm font-semibold ${t.type === "income" ? "text-chart-income" : "text-chart-expense"}`}>
              {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
