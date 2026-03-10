import { useState, useEffect, useCallback } from "react";
import { useFinance } from "@/context/FinanceContext";
import { buildFinancialContext } from "@/lib/financial-context";
import { t } from "@/lib/i18n";
import { Sparkles, AlertTriangle, TrendingUp, Lightbulb, Info, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Insight {
  type: "warning" | "positive" | "neutral" | "tip";
  text: string;
}

const typeConfig = {
  warning: { icon: AlertTriangle, colorClass: "text-chart-expense", bgClass: "bg-chart-expense/10" },
  positive: { icon: TrendingUp, colorClass: "text-chart-income", bgClass: "bg-chart-income/10" },
  neutral: { icon: Info, colorClass: "text-muted-foreground", bgClass: "bg-accent" },
  tip: { icon: Lightbulb, colorClass: "text-primary", bgClass: "bg-primary/10" },
};

export function AIInsightsCard() {
  const { transactions, payments, budgets, monthlyBudget } = useFinance();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const financialContext = buildFinancialContext(transactions, payments, budgets, monthlyBudget);
      const { data, error: fnError } = await supabase.functions.invoke("ai-insights", {
        body: { financialContext },
      });

      if (fnError) throw fnError;
      if (data?.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      } else if (data?.error) {
        setError(data.error);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה בטעינת תובנות");
    } finally {
      setLoading(false);
    }
  }, [transactions, payments, budgets, monthlyBudget]);

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-heading text-sm font-semibold text-foreground">{t.ai.insightsTitle}</h3>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {t.ai.refresh}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground me-2">{t.ai.analyzing}</span>
        </div>
      ) : error ? (
        <p className="text-sm text-muted-foreground py-4">{error}</p>
      ) : insights.length > 0 ? (
        <div className="space-y-3">
          {insights.map((insight, i) => {
            const config = typeConfig[insight.type] || typeConfig.neutral;
            const Icon = config.icon;
            return (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-md ${config.bgClass}`}>
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${config.colorClass}`} />
                <p className="text-sm text-foreground">{insight.text}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-4">{t.ai.noInsights}</p>
      )}
    </div>
  );
}
