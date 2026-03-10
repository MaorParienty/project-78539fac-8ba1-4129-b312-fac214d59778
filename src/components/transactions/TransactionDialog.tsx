import { useState, useEffect } from "react";
import { useFinance, Transaction } from "@/context/FinanceContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function TransactionDialog({ open, onOpenChange, transaction }: Props) {
  const { addTransaction, updateTransaction, categories } = useFinance();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setDate(transaction.date);
      setNotes(transaction.notes || "");
    } else {
      setType("expense");
      setAmount("");
      setCategory("Food");
      setDate(new Date().toISOString().split("T")[0]);
      setNotes("");
    }
  }, [transaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      type,
      amount: parseFloat(amount),
      category,
      date,
      notes,
      currency: "USD",
    };
    if (transaction) {
      updateTransaction({ ...data, id: transaction.id });
    } else {
      addTransaction(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{transaction ? "Edit" : "Add"} Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-1 bg-accent rounded-md p-1">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded text-sm font-medium transition-colors capitalize ${
                  type === t ? "bg-card text-foreground" : "text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Optional description"
              maxLength={200}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {transaction ? "Update" : "Add"} Transaction
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
