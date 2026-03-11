import { Transaction } from "@/context/FinanceContext";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { t, hebrewMonths } from "@/lib/i18n";

interface Props {
  transactions: Transaction[];
}

const tooltipStyle = {
  backgroundColor: "hsl(0 0% 100%)",
  border: "1px solid hsl(220 13% 91%)",
  borderRadius: "8px",
  color: "hsl(220 15% 15%)",
  fontSize: "12px",
};

export function IncomeExpenseChart({ transactions }: Props) {
  const shortMonths = hebrewMonths.slice(0, 6);
  const monthIndices = ["01", "02", "03", "04", "05", "06"];

  const data = shortMonths.map((m, idx) => {
    const key = monthIndices[idx];
    const monthTx = transactions.filter((tx) => tx.date.split("-")[1] === key);
    return {
      month: m,
      [t.dashboard.income]: monthTx.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0),
      [t.dashboard.expenses]: monthTx.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0),
    };
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-heading text-sm font-semibold text-foreground mb-4">{t.dashboard.incomeVsExpenses}</h3>
      <div className="h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey={t.dashboard.income} stroke="hsl(160 84% 39%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey={t.dashboard.expenses} stroke="hsl(0 84% 60%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-chart-income" /> {t.dashboard.income}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-chart-expense" /> {t.dashboard.expenses}
        </div>
      </div>
    </div>
  );
}
