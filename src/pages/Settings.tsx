import { useFinance } from "@/context/FinanceContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { User, Mail, CreditCard, Save } from "lucide-react";

const Settings = () => {
  const { monthlyBudget, setMonthlyBudget } = useFinance();
  const { user } = useAuth();
  const [budget, setBudget] = useState(monthlyBudget.toString());
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.display_name) setDisplayName(data.display_name);
        });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", user.id);
    if (error) toast.error(error.message);
    else toast.success(t.settings.saved);
    setLoading(false);
  };

  const handleSaveBudget = () => {
    const val = parseFloat(budget);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
      toast.success(t.settings.saved);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{t.settings.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.settings.subtitle}</p>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-4 w-4 text-primary" />
          <h2 className="font-heading text-sm font-semibold text-foreground">{t.settings.profile}</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.auth.email}</label>
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.settings.displayName}</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {t.settings.save}
          </button>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="h-4 w-4 text-primary" />
          <h2 className="font-heading text-sm font-semibold text-foreground">{t.settings.monthlyBudget}</h2>
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            step="100"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <button
            onClick={handleSaveBudget}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Save className="h-4 w-4" />
            {t.settings.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
