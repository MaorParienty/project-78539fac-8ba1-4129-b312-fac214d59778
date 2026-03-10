import { useFinance } from "@/context/FinanceContext";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { UpcomingPayments } from "@/components/dashboard/UpcomingPayments";

const Dashboard = () => {
  const { transactions, payments, monthlyBudget } = useFinance();

  const currentMonth = "2026-03";
  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth));
  const totalIncome = monthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = monthTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const remaining = monthlyBudget - totalExpenses;

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">March 2026 Overview</p>
      </div>

      <SummaryCards
        balance={balance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        remaining={remaining}
      />

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
