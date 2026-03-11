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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{t.transactions.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.transactions.count(filtered.length)}</p>
        </div>
        <button
          onClick={() => { setEditingTransaction(null); setDialogOpen(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
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
            className="w-full bg-card border border-border rounded-lg ps-9 pe-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
          {([
            { key: "all" as const, label: t.transactions.all },
            { key: "income" as const, label: t.transactions.income },
            { key: "expense" as const, label: t.transactions.expense },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filterType === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map((tx) => (
          <div key={tx.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs bg-accent text-muted-foreground px-2 py-0.5 rounded-md">{translateCategory(tx.category)}</span>
              <span className="text-xs text-muted-foreground">{formatDateFullHe(tx.date)}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">{tx.notes || t.transactions.noDescription}</p>
              <p className={`font-heading font-bold ${tx.type === "income" ? "text-chart-income" : "text-chart-expense"}`}>
                {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
              </p>
            </div>
            <div className="flex gap-1 justify-end mt-2">
              <button onClick={() => { setEditingTransaction(tx); setDialogOpen(true); }} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-card border border-border rounded-xl overflow-hidden">
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
                  <span className="text-xs bg-accent text-muted-foreground px-2 py-0.5 rounded-md">{translateCategory(tx.category)}</span>
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
