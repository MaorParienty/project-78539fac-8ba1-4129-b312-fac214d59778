import { useState } from "react";
import { useFinance, Transaction } from "@/context/FinanceContext";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const Transactions = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filtered = transactions
    .filter((t) => filterType === "all" || t.type === filterType)
    .filter((t) =>
      (t.notes?.toLowerCase() || "").includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} transactions</p>
        </div>
        <button
          onClick={() => { setEditingTransaction(null); setDialogOpen(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Transaction
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1 bg-card border border-border rounded-md p-1">
          {(["all", "income", "expense"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
                filterType === type ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">{format(new Date(t.date), "MMM d, yyyy")}</td>
                <td className="px-4 py-3 text-foreground">{t.notes || "—"}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-accent text-muted-foreground px-2 py-0.5 rounded">{t.category}</span>
                </td>
                <td className={`px-4 py-3 text-right font-heading font-semibold ${t.type === "income" ? "text-chart-income" : "text-chart-expense"}`}>
                  {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => { setEditingTransaction(t); setDialogOpen(true); }}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
