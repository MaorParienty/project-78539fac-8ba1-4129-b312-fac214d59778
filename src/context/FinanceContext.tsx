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
  { id: "1", type: "income", amount: 18500, category: "Salary", date: "2026-03-01", notes: "משכורת חודשית", currency: "ILS" },
  { id: "2", type: "expense", amount: 4800, category: "Housing", date: "2026-03-01", notes: "שכר דירה", currency: "ILS" },
  { id: "3", type: "expense", amount: 320, category: "Food", date: "2026-03-02", notes: "קניות במכולת", currency: "ILS" },
  { id: "4", type: "expense", amount: 450, category: "Utilities", date: "2026-03-03", notes: "חשבון חשמל", currency: "ILS" },
  { id: "5", type: "expense", amount: 180, category: "Transportation", date: "2026-03-04", notes: "דלק", currency: "ILS" },
  { id: "6", type: "expense", amount: 250, category: "Entertainment", date: "2026-03-05", notes: "ארוחה בחוץ", currency: "ILS" },
  { id: "7", type: "income", amount: 3200, category: "Freelance", date: "2026-03-06", notes: "פרויקט עיצוב", currency: "ILS" },
  { id: "8", type: "expense", amount: 780, category: "Shopping", date: "2026-03-07", notes: "נעליים חדשות", currency: "ILS" },
  { id: "9", type: "expense", amount: 200, category: "Health", date: "2026-03-08", notes: "בית מרקחת", currency: "ILS" },
  { id: "10", type: "expense", amount: 145, category: "Food", date: "2026-03-09", notes: "משלוח", currency: "ILS" },
];

const samplePayments: Payment[] = [
  { id: "p1", name: "נטפליקס", amount: 49.90, type: "recurring", dueDate: "2026-03-15", category: "Entertainment", currency: "ILS", isPaid: false },
  { id: "p2", name: "חדר כושר", amount: 189, type: "recurring", dueDate: "2026-03-20", category: "Health", currency: "ILS", isPaid: false },
  { id: "p3", name: "ביטוח רכב", amount: 650, type: "recurring", dueDate: "2026-03-25", category: "Transportation", currency: "ILS", isPaid: false },
  { id: "p4", name: "מחשב נייד", amount: 4500, type: "scheduled", dueDate: "2026-04-01", category: "Shopping", currency: "ILS", isPaid: false },
];

const sampleBudgets: Budget[] = [
  { id: "b1", category: "Food", limit: 1500, spent: 465, month: "2026-03" },
  { id: "b2", category: "Transportation", limit: 800, spent: 180, month: "2026-03" },
  { id: "b3", category: "Entertainment", limit: 600, spent: 250, month: "2026-03" },
  { id: "b4", category: "Shopping", limit: 1000, spent: 780, month: "2026-03" },
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
  const [monthlyBudget, setMonthlyBudget] = useState(10000);

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
        transactions, payments, budgets, categories: CATEGORIES,
        monthlyBudget, addTransaction, updateTransaction, deleteTransaction,
        addPayment, updatePayment, deletePayment, setBudgets, setMonthlyBudget,
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
