import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { buildFinancialContext } from "@/lib/financial-context";
import { t } from "@/lib/i18n";
import { FileText, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

const WeeklyReports = () => {
  const { transactions, payments, budgets, monthlyBudget } = useFinance();
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const financialContext = buildFinancialContext(transactions, payments, budgets, monthlyBudget);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      const weekRange = `${weekStart.toISOString().split("T")[0]} - ${now.toISOString().split("T")[0]}`;

      const { data, error: fnError } = await supabase.functions.invoke("ai-weekly-report", {
        body: { financialContext, weekRange },
      });

      if (fnError) throw fnError;
      if (data?.report) {
        setReport(data.report);
      } else if (data?.error) {
        setError(data.error);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה ביצירת הדוח");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{t.ai.weeklyTitle}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t.ai.weeklySubtitle}</p>
        </div>
        <button
          onClick={generateReport}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : report ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          {loading ? t.ai.generating : report ? t.ai.regenerate : t.ai.generateReport}
        </button>
      </div>

      {error && (
        <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4">
          <p className="text-sm text-chart-expense">{error}</p>
        </div>
      )}

      {!report && !loading && !error && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{t.ai.noReportYet}</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">{t.ai.noReportDesc}</p>
          <button
            onClick={generateReport}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t.ai.generateReport}
          </button>
        </div>
      )}

      {loading && !report && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{t.ai.generatingReport}</p>
        </div>
      )}

      {report && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReports;
