import { useFinance } from "@/context/FinanceContext";
import { t, formatCurrency, translateCategory } from "@/lib/i18n";

const Budgets = () => {
  const { budgets, monthlyBudget } = useFinance();
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overallPercent = Math.min((totalSpent / monthlyBudget) * 100, 100);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{t.budgets.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">מרץ 2026</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{t.budgets.overallBudget}</span>
          <span className="font-heading text-sm font-semibold text-foreground">
            {formatCurrency(totalSpent)} / {formatCurrency(monthlyBudget)}
          </span>
        </div>
        <div className="h-2.5 bg-accent rounded-full overflow-hidden" dir="ltr">
          <div
            className={`h-full rounded-full transition-all ${overallPercent > 90 ? "bg-chart-expense" : "bg-primary"}`}
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        {overallPercent > 80 && (
          <p className="text-xs text-chart-expense mt-2">{t.budgets.warning(Math.round(overallPercent))}</p>
        )}
      </div>

      <div className="space-y-3">
        {budgets.map((b) => {
          const pct = Math.min((b.spent / b.limit) * 100, 100);
          return (
            <div key={b.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground font-medium">{translateCategory(b.category)}</span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                </span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden" dir="ltr">
                <div
                  className={`h-full rounded-full transition-all ${pct > 90 ? "bg-chart-expense" : pct > 70 ? "bg-primary" : "bg-chart-income"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;
