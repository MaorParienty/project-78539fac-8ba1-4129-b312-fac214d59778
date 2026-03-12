import { Transaction, Payment, Budget } from "@/context/FinanceContext";
import { translateCategory } from "@/lib/i18n";

export function buildFinancialContext(
  transactions: Transaction[],
  payments: Payment[],
  budgets: Budget[],
  monthlyBudget: number
): string {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTx = transactions.filter((t) => t.date.startsWith(currentMonth));
  const income = monthTx.filter((t) => t.type === "income");
  const expenses = monthTx.filter((t) => t.type === "expense");
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const categoryBreakdown = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `  - ${translateCategory(cat)}: ₪${amt.toFixed(2)}`)
    .join("\n");

  const recentTx = monthTx
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 15)
    .map((t) => `  - ${t.date} | ${t.type === "income" ? "הכנסה" : "הוצאה"} | ${translateCategory(t.category)} | ₪${t.amount} | ${t.notes || ""}`)
    .join("\n");

  const upcomingPayments = payments
    .filter((p) => !p.isPaid)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .map((p) => `  - ${p.name}: ₪${p.amount} (${p.type === "recurring" ? "חוזר" : p.type === "one-time" ? "חד פעמי" : "מתוכנן"}) - ${p.dueDate}`)
    .join("\n");

  const budgetStatus = budgets
    .map((b) => {
      const pct = ((b.spent / b.limit) * 100).toFixed(0);
      return `  - ${translateCategory(b.category)}: ₪${b.spent} / ₪${b.limit} (${pct}%)`;
    })
    .join("\n");

  return `תאריך: ${now.toISOString().split("T")[0]}
חודש נוכחי: ${currentMonth}

תקציב חודשי: ₪${monthlyBudget}
סה"כ הכנסות החודש: ₪${totalIncome}
סה"כ הוצאות החודש: ₪${totalExpenses}
יתרה: ₪${(totalIncome - totalExpenses).toFixed(2)}

פילוח הוצאות לפי קטגוריה:
${categoryBreakdown}

סטטוס תקציבים:
${budgetStatus}

תנועות אחרונות:
${recentTx}

תשלומים קרובים:
${upcomingPayments}

סה"כ תנועות החודש: ${monthTx.length}
סה"כ תשלומים ממתינים: ${payments.filter((p) => !p.isPaid).length}`;
}
