import { Transaction } from "@/context/FinanceContext";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface Props {
  transactions: Transaction[];
}

export function IncomeExpenseChart({ transactions }: Props) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthMap: Record<string, string> = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
  };

  const data = months.map((m) => {
    const monthTx = transactions.filter((t) => {
      const txMonth = monthMap[t.date.split("-")[1]];
      return txMonth === m;
    });
    return {
      month: m,
      income: monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expenses: monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Income vs Expenses</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 2% 18%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(0 0% 54%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(0 0% 54%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(240 2% 12%)",
                border: "1px solid hsl(240 2% 18%)",
                borderRadius: "8px",
                color: "hsl(240 5% 96%)",
                fontSize: "12px",
              }}
            />
            <Line type="monotone" dataKey="income" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="expenses" stroke="hsl(4 77% 60%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-chart-income" /> Income
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-chart-expense" /> Expenses
        </div>
      </div>
    </div>
  );
}
