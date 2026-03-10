import { Transaction } from "@/context/FinanceContext";
import { t, formatCurrency, formatDateHe, translateCategory } from "@/lib/i18n";

interface Props {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-heading text-sm font-semibold text-foreground mb-4">{t.dashboard.recentTransactions}</h3>
      <div className="space-y-0">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{tx.notes || translateCategory(tx.category)}</p>
              <p className="text-xs text-muted-foreground">{translateCategory(tx.category)} · {formatDateHe(tx.date)}</p>
            </div>
            <span className={`font-heading text-sm font-semibold ${tx.type === "income" ? "text-chart-income" : "text-chart-expense"}`}>
              {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
