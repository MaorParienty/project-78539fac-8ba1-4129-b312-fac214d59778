import { useState } from "react";
import { useFinance, Payment } from "@/context/FinanceContext";
import { Plus, Trash2, Check, Clock, Calendar, CreditCard } from "lucide-react";
import { PaymentDialog } from "@/components/payments/PaymentDialog";
import { t, formatCurrency, formatDateFullHe, translateCategory } from "@/lib/i18n";

const typeIcons = { recurring: Clock, "one-time": CreditCard, scheduled: Calendar };
const typeLabels: Record<string, string> = {
  recurring: t.payments.recurring,
  "one-time": t.payments.oneTime,
  scheduled: t.payments.scheduled,
};

const Payments = () => {
  const { payments, updatePayment, deletePayment } = useFinance();
  const [dialogOpen, setDialogOpen] = useState(false);

  const upcoming = payments.filter((p) => !p.isPaid).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const paid = payments.filter((p) => p.isPaid);
  const togglePaid = (p: Payment) => updatePayment({ ...p, isPaid: !p.isPaid });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">{t.payments.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.payments.subtitle}</p>
        </div>
        <button onClick={() => setDialogOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> {t.payments.addPayment}
        </button>
      </div>

      <div>
        <h2 className="font-heading text-sm font-semibold text-foreground mb-3">{t.payments.upcoming}</h2>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {upcoming.map((p) => {
            const Icon = typeIcons[p.type];
            return (
              <div key={p.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-foreground font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{typeLabels[p.type]} · {formatDateFullHe(p.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-heading text-sm font-semibold text-foreground">{formatCurrency(p.amount)}</span>
                  <button onClick={() => togglePaid(p)} className="p-1.5 text-muted-foreground hover:text-chart-income transition-colors">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => deletePayment(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {upcoming.length === 0 && <p className="p-4 text-sm text-muted-foreground">{t.payments.noUpcoming}</p>}
        </div>
      </div>

      {paid.length > 0 && (
        <div>
          <h2 className="font-heading text-sm font-semibold text-muted-foreground mb-3">{t.payments.paid}</h2>
          <div className="bg-card border border-border rounded-lg divide-y divide-border opacity-60">
            {paid.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-foreground line-through">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{translateCategory(p.category)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-heading text-sm text-muted-foreground">{formatCurrency(p.amount)}</span>
                  <button onClick={() => togglePaid(p)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <PaymentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

// Need to import this
import { translateCategory } from "@/lib/i18n";

export default Payments;
