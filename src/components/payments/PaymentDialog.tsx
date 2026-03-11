import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { t, translateCategory } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDialog({ open, onOpenChange }: Props) {
  const { addPayment, categories } = useFinance();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"recurring" | "one-time" | "scheduled">("recurring");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Utilities");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayment({ name, amount: parseFloat(amount), type, dueDate, category, currency: "ILS", isPaid: false });
    onOpenChange(false);
    setName(""); setAmount("");
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md rounded-xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-heading">{t.payments.addPayment}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.payments.name}</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.transactions.amount}</label>
            <input type="number" step="0.01" min="0" required value={amount} onChange={(e) => setAmount(e.target.value)}
              className={inputClass} placeholder="0.00" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.payments.type}</label>
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className={inputClass}>
              <option value="recurring">{t.payments.recurring}</option>
              <option value="one-time">{t.payments.oneTime}</option>
              <option value="scheduled">{t.payments.scheduled}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.payments.dueDate}</label>
            <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.transactions.category}</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {categories.map((c) => <option key={c} value={c}>{translateCategory(c)}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            {t.payments.addPayment}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
