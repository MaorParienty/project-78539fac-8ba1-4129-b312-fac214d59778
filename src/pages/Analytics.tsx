import { useFinance } from "@/context/FinanceContext";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = [
  "hsl(43 56% 52%)", "hsl(142 71% 45%)", "hsl(4 77% 60%)", "hsl(210 60% 50%)",
  "hsl(280 50% 55%)", "hsl(30 80% 55%)", "hsl(180 50% 45%)", "hsl(340 60% 55%)",
];

const tooltipStyle = {
  backgroundColor: "hsl(240 2% 12%)",
  border: "1px solid hsl(240 2% 18%)",
  borderRadius: "8px",
  color: "hsl(240 5% 96%)",
  fontSize: "12px",
};

const Analytics = () => {
  const { transactions } = useFinance();

  const currentMonth = transactions.filter((t) => t.date.startsWith("2026-03"));
  const expenses = currentMonth.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const largestCategory = pieData[0];

  // Daily spending
  const dailySpend = expenses.reduce<Record<string, number>>((acc, t) => {
    const day = t.date.split("-")[2];
    acc[day] = (acc[day] || 0) + t.amount;
    return acc;
  }, {});

  const dailyData = Object.entries(dailySpend)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, amount]) => ({ day: `Mar ${parseInt(day)}`, amount }));

  // Monthly comparison (mock)
  const monthlyData = [
    { month: "Jan", income: 5000, expenses: 3200 },
    { month: "Feb", income: 5200, expenses: 3800 },
    { month: "Mar", income: 6000, expenses: totalExpenses },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Spending insights and trends</p>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Spending</p>
          <p className="font-heading text-xl font-semibold text-chart-expense">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Largest Category</p>
          <p className="font-heading text-xl font-semibold text-primary">{largestCategory?.name || "—"}</p>
          <p className="text-xs text-muted-foreground">${largestCategory?.value.toFixed(2) || "0"}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Daily Average</p>
          <p className="font-heading text-xl font-semibold text-foreground">
            ${(totalExpenses / Math.max(Object.keys(dailySpend).length, 1)).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">By Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toFixed(2)}`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Daily Spending</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 2% 18%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(0 0% 54%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(0 0% 54%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="amount" stroke="hsl(43 56% 52%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(43 56% 52%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly comparison */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="font-heading text-sm font-semibold text-foreground mb-4">Monthly Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 2% 18%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(0 0% 54%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(0 0% 54%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="income" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="hsl(4 77% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
