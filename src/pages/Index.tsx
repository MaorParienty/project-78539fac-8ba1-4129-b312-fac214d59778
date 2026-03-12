import { useFinance } from "@/context/FinanceContext";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { UpcomingPayments } from "@/components/dashboard/UpcomingPayments";
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { t, hebrewMonths } from "@/lib/i18n";

const Dashboard = () => {
  const { transactions, payments } = useFinance();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTransactions = transactions.filter((tx) => tx.date.startsWith(currentMonth));
  const totalIncome = monthTransactions.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
  const totalExpenses = monthTransactions.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{t.dashboard.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t.dashboard.subtitle} — {hebrewMonths[now.getMonth()]} {now.getFullYear()}
        </p>
      </div>

      <SummaryCards balance={balance} totalIncome={totalIncome} totalExpenses={totalExpenses} />

      <AIInsightsCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart transactions={transactions} />
        <ExpensePieChart transactions={monthTransactions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={monthTransactions.slice(0, 8)} />
        <UpcomingPayments payments={payments.filter((p) => !p.isPaid)} />
      </div>
    </div>
  );
};

export default Dashboard;
