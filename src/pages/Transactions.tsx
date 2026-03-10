import { useState } from "react";
import { useFinance, Transaction } from "@/context/FinanceContext";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { t, formatCurrency, formatDateFullHe, translateCategory } from "@/lib/i18n";

const Transactions = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filtered = transactions
    .filter((tx) => filterType === "all" || tx.type === filterType)
    .filter((tx) =>
      (tx.notes?.toLowerCase() || "").includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase()) ||
      translateCategory(tx.category).includes(search)
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">{t.transactions.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.transactions.count(filtered.length)}</p>
        </div>
        <button
          onClick={() => { setEditingTransaction(null); setDialogOpen(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> {t.transactions.addTransaction}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.transactions.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-md ps-9 pe-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1 bg-card border border-border rounded-md p-1">
          {([
            { key: "all" as const, label: t.transactions.all },
            { key: "income" as const, label: t.transactions.income },
            { key: "expense" as const, label: t.transactions.expense },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                filterType === key ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-start px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.transactions.date}</th>
              <th className="text-start px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.transactions.description}</th>
              <th className="text-start px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.transactions.category}</th>
              <th className="text-start px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.transactions.amount}</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">{formatDateFullHe(tx.date)}</td>
                <td className="px-4 py-3 text-foreground">{tx.notes || t.transactions.noDescription}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-accent text-muted-foreground px-2 py-0.5 rounded">{translateCategory(tx.category)}</span>
                </td>
                <td className={`px-4 py-3 font-heading font-semibold ${tx.type === "income" ? "text-chart-income" : "text-chart-expense"}`}>
                  {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => { setEditingTransaction(tx); setDialogOpen(true); }} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} transaction={editingTransaction} />
    </div>
  );
};

export default Transactions;
