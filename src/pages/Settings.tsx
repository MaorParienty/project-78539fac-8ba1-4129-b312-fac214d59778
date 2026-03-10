import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";
import { t } from "@/lib/i18n";

const Settings = () => {
  const { monthlyBudget, setMonthlyBudget } = useFinance();
  const [budget, setBudget] = useState(monthlyBudget.toString());

  const handleSave = () => {
    const val = parseFloat(budget);
    if (!isNaN(val) && val > 0) setMonthlyBudget(val);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t.settings.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.settings.subtitle}</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">{t.settings.monthlyBudget}</h2>
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            step="100"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            {t.settings.save}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">{t.settings.account}</h2>
        <p className="text-sm text-muted-foreground">{t.settings.accountDesc}</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h2 className="font-heading text-sm font-semibold text-foreground">{t.settings.exportData}</h2>
        <p className="text-sm text-muted-foreground">{t.settings.exportDesc}</p>
      </div>
    </div>
  );
};

export default Settings;
