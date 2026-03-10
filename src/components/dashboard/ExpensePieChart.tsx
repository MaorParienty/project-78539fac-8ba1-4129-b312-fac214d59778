import { Transaction } from "@/context/FinanceContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { t, translateCategory } from "@/lib/i18n";

const COLORS = [
  "hsl(43 56% 52%)", "hsl(142 71% 45%)", "hsl(4 77% 60%)", "hsl(210 60% 50%)",
  "hsl(280 50% 55%)", "hsl(30 80% 55%)", "hsl(180 50% 45%)", "hsl(340 60% 55%)",
];

interface Props {
  transactions: Transaction[];
}

export function ExpensePieChart({ transactions }: Props) {
  const expenses = transactions.filter((tx) => tx.type === "expense");
  const byCategory = expenses.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  const data = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="font-heading text-sm font-semibold text-foreground mb-4">{t.dashboard.expenseDistribution}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(240 2% 12%)", border: "1px solid hsl(240 2% 18%)", borderRadius: "8px", color: "hsl(240 5% 96%)", fontSize: "12px" }}
              formatter={(value: number) => [`₪${value.toFixed(2)}`, ""]}
              labelFormatter={(label) => translateCategory(label)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {translateCategory(d.name)}
          </div>
        ))}
      </div>
    </div>
  );
}
