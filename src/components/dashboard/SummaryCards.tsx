import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

interface Props {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  remaining: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const cards = [
  { label: "Current Balance", icon: Wallet, key: "balance" as const, colorClass: "text-foreground" },
  { label: "Monthly Income", icon: TrendingUp, key: "totalIncome" as const, colorClass: "text-chart-income" },
  { label: "Monthly Expenses", icon: TrendingDown, key: "totalExpenses" as const, colorClass: "text-chart-expense" },
  { label: "Remaining Budget", icon: PiggyBank, key: "remaining" as const, colorClass: "text-primary" },
];

export function SummaryCards(props: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="bg-card border border-border rounded-lg p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{c.label}</span>
            <c.icon className={`h-4 w-4 ${c.colorClass}`} />
          </div>
          <p className={`font-heading text-2xl font-semibold ${c.colorClass}`}>
            {fmt(props[c.key])}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
