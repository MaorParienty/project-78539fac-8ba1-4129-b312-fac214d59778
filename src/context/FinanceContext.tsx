import { useState, createContext, useContext, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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

interface FinanceContextType {
  transactions: Transaction[];
  payments: Payment[];
  budgets: Budget[];
  categories: string[];
  monthlyBudget: number;
  loading: boolean;
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
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [budgets, setBudgetsState] = useState<Budget[]>([]);
  const [monthlyBudget, setMonthlyBudgetState] = useState(5000);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  // Load data from Supabase
  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      setLoading(true);
      const [txRes, payRes, budRes, profRes] = await Promise.all([
        supabase.from("transactions").select("*").order("date", { ascending: false }),
        supabase.from("payments").select("*").order("due_date", { ascending: true }),
        supabase.from("budgets").select("*"),
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
      ]);

      if (txRes.data) {
        setTransactions(txRes.data.map((r) => ({
          id: r.id,
          type: r.type as TransactionType,
          amount: Number(r.amount),
          category: r.category,
          date: r.date,
          notes: r.notes ?? undefined,
          currency: r.currency,
        })));
      }

      if (payRes.data) {
        setPayments(payRes.data.map((r) => ({
          id: r.id,
          name: r.name,
          amount: Number(r.amount),
          type: r.type as Payment["type"],
          dueDate: r.due_date,
          category: r.category,
          currency: r.currency,
          isPaid: r.is_paid,
        })));
      }

      if (budRes.data) {
        setBudgetsState(budRes.data.map((r) => ({
          id: r.id,
          category: r.category,
          limit: Number(r.budget_limit),
          spent: Number(r.spent),
          month: r.month,
        })));
      }

      if (profRes.data) {
        setMonthlyBudgetState(Number(profRes.data.monthly_budget));
      }

      setLoading(false);
    };

    loadData();
  }, [userId]);

  const addTransaction = useCallback(async (t: Omit<Transaction, "id">) => {
    if (!userId) return;
    const { data, error } = await supabase.from("transactions").insert({
      user_id: userId,
      type: t.type,
      amount: t.amount,
      category: t.category,
      date: t.date,
      notes: t.notes || null,
      currency: t.currency,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    if (data) {
      setTransactions((prev) => [{
        id: data.id, type: data.type as TransactionType, amount: Number(data.amount),
        category: data.category, date: data.date, notes: data.notes ?? undefined, currency: data.currency,
      }, ...prev]);
    }
  }, [userId]);

  const updateTransaction = useCallback(async (t: Transaction) => {
    const { error } = await supabase.from("transactions").update({
      type: t.type, amount: t.amount, category: t.category,
      date: t.date, notes: t.notes || null, currency: t.currency,
    }).eq("id", t.id);
    if (error) { toast.error(error.message); return; }
    setTransactions((prev) => prev.map((x) => (x.id === t.id ? t : x)));
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setTransactions((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addPayment = useCallback(async (p: Omit<Payment, "id">) => {
    if (!userId) return;
    const { data, error } = await supabase.from("payments").insert({
      user_id: userId, name: p.name, amount: p.amount, type: p.type,
      due_date: p.dueDate, category: p.category, currency: p.currency, is_paid: p.isPaid,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    if (data) {
      setPayments((prev) => [{
        id: data.id, name: data.name, amount: Number(data.amount),
        type: data.type as Payment["type"], dueDate: data.due_date,
        category: data.category, currency: data.currency, isPaid: data.is_paid,
      }, ...prev]);
    }
  }, [userId]);

  const updatePayment = useCallback(async (p: Payment) => {
    const { error } = await supabase.from("payments").update({
      name: p.name, amount: p.amount, type: p.type,
      due_date: p.dueDate, category: p.category, currency: p.currency, is_paid: p.isPaid,
    }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    setPayments((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  }, []);

  const deletePayment = useCallback(async (id: string) => {
    const { error } = await supabase.from("payments").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setPayments((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const setBudgets = useCallback(async (b: Budget[]) => {
    setBudgetsState(b);
  }, []);

  const setMonthlyBudget = useCallback(async (v: number) => {
    if (!userId) return;
    const { error } = await supabase.from("profiles").update({ monthly_budget: v }).eq("user_id", userId);
    if (error) { toast.error(error.message); return; }
    setMonthlyBudgetState(v);
  }, [userId]);

  return (
    <FinanceContext.Provider
      value={{
        transactions, payments, budgets, categories: CATEGORIES,
        monthlyBudget, loading, addTransaction, updateTransaction, deleteTransaction,
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
