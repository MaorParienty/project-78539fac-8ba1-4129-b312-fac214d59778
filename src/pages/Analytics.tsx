import { useFinance } from "@/context/FinanceContext";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { t, formatCurrency, translateCategory, hebrewMonths } from "@/lib/i18n";

const COLORS = [
  "hsl(225 65% 52%)", "hsl(160 84% 39%)", "hsl(0 84% 60%)", "hsl(210 60% 50%)",
  "hsl(280 50% 55%)", "hsl(30 80% 55%)", "hsl(180 50% 45%)", "hsl(340 60% 55%)",
];

const tooltipStyle = {
  backgroundColor: "hsl(0 0% 100%)",
  border: "1px solid hsl(220 13% 91%)",
  borderRadius: "8px",
  color: "hsl(220 15% 15%)",
  fontSize: "12px",
};

const Analytics = () => {
  const { transactions } = useFinance();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthTx = transactions.filter((tx) => tx.date.startsWith(currentMonth));
  const expenses = currentMonthTx.filter((tx) => tx.type === "expense");
  const totalExpenses = expenses.reduce((s, tx) => s + tx.amount, 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  const pieData = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  const largestCategory = pieData[0];

  const dailySpend = expenses.reduce<Record<string, number>>((acc, tx) => {
    const day = tx.date.split("-")[2];
    acc[day] = (acc[day] || 0) + tx.amount;
    return acc;
  }, {});

  const dailyData = Object.entries(dailySpend).sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, amount]) => ({ day: `${parseInt(day)}`, amount }));

  const monthlyData = [
    { month: hebrewMonths[0], [t.dashboard.income]: 17000, [t.dashboard.expenses]: 11500 },
    { month: hebrewMonths[1], [t.dashboard.income]: 18500, [t.dashboard.expenses]: 13800 },
    { month: hebrewMonths[2], [t.dashboard.income]: 21700, [t.dashboard.expenses]: totalExpenses },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{t.analytics.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.analytics.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.analytics.totalSpending}</p>
          <p className="font-heading text-xl font-bold text-chart-expense">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.analytics.largestCategory}</p>
          <p className="font-heading text-xl font-bold text-primary">{largestCategory ? translateCategory(largestCategory.name) : "—"}</p>
          <p className="text-xs text-muted-foreground">{largestCategory ? formatCurrency(largestCategory.value) : "₪0"}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.analytics.dailyAverage}</p>
          <p className="font-heading text-xl font-bold text-foreground">
            {formatCurrency(totalExpenses / Math.max(Object.keys(dailySpend).length, 1))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">{t.analytics.byCategory}</h3>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₪${v.toFixed(2)}`, ""]} labelFormatter={(l) => translateCategory(l)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading text-sm font-semibold text-foreground mb-4">{t.analytics.dailySpending}</h3>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="amount" stroke="hsl(225 65% 52%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(225 65% 52%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-heading text-sm font-semibold text-foreground mb-4">{t.analytics.monthlyComparison}</h3>
        <div className="h-64" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey={t.dashboard.income} fill="hsl(160 84% 39%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey={t.dashboard.expenses} fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
