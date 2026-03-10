import { useState, createContext, useContext, ReactNode } from "react";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  currency: string;
}

export interface Payment {
  id: string;
  name: string;
  amount: number;
  type: "recurring" | "one-time" | "scheduled";
  dueDate: string;
  category: string;
  currency: string;
  isPaid: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
}

const CATEGORIES = ["Food", "Housing", "Transportation", "Entertainment", "Utilities", "Health", "Shopping", "Salary", "Freelance", "Investment", "Other"];

const sampleTransactions: Transaction[] = [
  { id: "1", type: "income", amount: 5200, category: "Salary", date: "2026-03-01", notes: "Monthly salary", currency: "USD" },
  { id: "2", type: "expense", amount: 1400, category: "Housing", date: "2026-03-01", notes: "Rent", currency: "USD" },
  { id: "3", type: "expense", amount: 85, category: "Food", date: "2026-03-02", notes: "Groceries", currency: "USD" },
  { id: "4", type: "expense", amount: 120, category: "Utilities", date: "2026-03-03", notes: "Electricity bill", currency: "USD" },
  { id: "5", type: "expense", amount: 45, category: "Transportation", date: "2026-03-04", notes: "Gas", currency: "USD" },
  { id: "6", type: "expense", amount: 65, category: "Entertainment", date: "2026-03-05", notes: "Streaming + dinner out", currency: "USD" },
  { id: "7", type: "income", amount: 800, category: "Freelance", date: "2026-03-06", notes: "Design project", currency: "USD" },
  { id: "8", type: "expense", amount: 210, category: "Shopping", date: "2026-03-07", notes: "New shoes", currency: "USD" },
  { id: "9", type: "expense", amount: 55, category: "Health", date: "2026-03-08", notes: "Pharmacy", currency: "USD" },
  { id: "10", type: "expense", amount: 38, category: "Food", date: "2026-03-09", notes: "Takeout", currency: "USD" },
];

const samplePayments: Payment[] = [
  { id: "p1", name: "Netflix", amount: 15.99, type: "recurring", dueDate: "2026-03-15", category: "Entertainment", currency: "USD", isPaid: false },
  { id: "p2", name: "Gym Membership", amount: 49.99, type: "recurring", dueDate: "2026-03-20", category: "Health", currency: "USD", isPaid: false },
  { id: "p3", name: "Car Insurance", amount: 180, type: "recurring", dueDate: "2026-03-25", category: "Transportation", currency: "USD", isPaid: false },
  { id: "p4", name: "New Laptop", amount: 1299, type: "scheduled", dueDate: "2026-04-01", category: "Shopping", currency: "USD", isPaid: false },
];

const sampleBudgets: Budget[] = [
  { id: "b1", category: "Food", limit: 400, spent: 123, month: "2026-03" },
  { id: "b2", category: "Transportation", limit: 200, spent: 45, month: "2026-03" },
  { id: "b3", category: "Entertainment", limit: 150, spent: 65, month: "2026-03" },
  { id: "b4", category: "Shopping", limit: 300, spent: 210, month: "2026-03" },
];

interface FinanceContextType {
  transactions: Transaction[];
  payments: Payment[];
  budgets: Budget[];
  categories: string[];
  monthlyBudget: number;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addPayment: (p: Omit<Payment, "id">) => void;
  updatePayment: (p: Payment) => void;
  deletePayment: (id: string) => void;
  setBudgets: (b: Budget[]) => void;
  setMonthlyBudget: (v: number) => void;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [payments, setPayments] = useState<Payment[]>(samplePayments);
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
  const [monthlyBudget, setMonthlyBudget] = useState(3000);

  const addTransaction = (t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  };
  const updateTransaction = (t: Transaction) => {
    setTransactions((prev) => prev.map((x) => (x.id === t.id ? t : x)));
  };
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((x) => x.id !== id));
  };
  const addPayment = (p: Omit<Payment, "id">) => {
    setPayments((prev) => [{ ...p, id: crypto.randomUUID() }, ...prev]);
  };
  const updatePayment = (p: Payment) => {
    setPayments((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  };
  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        payments,
        budgets,
        categories: CATEGORIES,
        monthlyBudget,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addPayment,
        updatePayment,
        deletePayment,
        setBudgets,
        setMonthlyBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
