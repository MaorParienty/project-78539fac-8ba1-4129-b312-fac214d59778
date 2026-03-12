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

function mapTransaction(r: any): Transaction {
  return {
    id: r.id,
    type: r.type as TransactionType,
    amount: Number(r.amount),
    category: r.category,
    date: r.date,
    notes: r.notes ?? undefined,
    currency: r.currency,
  };
}

function mapPayment(r: any): Payment {
  return {
    id: r.id,
    name: r.name,
    amount: Number(r.amount),
    type: r.type as Payment["type"],
    dueDate: r.due_date,
    category: r.category,
    currency: r.currency,
    isPaid: r.is_paid,
  };
}

function mapBudget(r: any): Budget {
  return {
    id: r.id,
    category: r.category,
    limit: Number(r.budget_limit),
    spent: Number(r.spent),
    month: r.month,
  };
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [budgets, setBudgetsState] = useState<Budget[]>([]);
  const [monthlyBudget, setMonthlyBudgetState] = useState(5000);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  // Load data from database
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

      if (txRes.data) setTransactions(txRes.data.map(mapTransaction));
      if (payRes.data) setPayments(payRes.data.map(mapPayment));
      if (budRes.data) setBudgetsState(budRes.data.map(mapBudget));
      if (profRes.data) setMonthlyBudgetState(Number(profRes.data.monthly_budget));

      setLoading(false);
    };

    loadData();
  }, [userId]);

  // Realtime subscriptions for shared account sync
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("finance-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setTransactions((prev) => {
            if (prev.some((t) => t.id === (payload.new as any).id)) return prev;
            return [mapTransaction(payload.new), ...prev];
          });
        } else if (payload.eventType === "UPDATE") {
          setTransactions((prev) => prev.map((t) => t.id === (payload.new as any).id ? mapTransaction(payload.new) : t));
        } else if (payload.eventType === "DELETE") {
          setTransactions((prev) => prev.filter((t) => t.id !== (payload.old as any).id));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "payments" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setPayments((prev) => {
            if (prev.some((p) => p.id === (payload.new as any).id)) return prev;
            return [mapPayment(payload.new), ...prev];
          });
        } else if (payload.eventType === "UPDATE") {
          setPayments((prev) => prev.map((p) => p.id === (payload.new as any).id ? mapPayment(payload.new) : p));
        } else if (payload.eventType === "DELETE") {
          setPayments((prev) => prev.filter((p) => p.id !== (payload.old as any).id));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "budgets" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setBudgetsState((prev) => {
            if (prev.some((b) => b.id === (payload.new as any).id)) return prev;
            return [...prev, mapBudget(payload.new)];
          });
        } else if (payload.eventType === "UPDATE") {
          setBudgetsState((prev) => prev.map((b) => b.id === (payload.new as any).id ? mapBudget(payload.new) : b));
        } else if (payload.eventType === "DELETE") {
          setBudgetsState((prev) => prev.filter((b) => b.id !== (payload.old as any).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const addTransaction = useCallback(async (t: Omit<Transaction, "id">) => {
    if (!userId) return;
    const { data, error } = await supabase.from("transactions").insert({
      user_id: userId, type: t.type, amount: t.amount, category: t.category,
      date: t.date, notes: t.notes || null, currency: t.currency,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    if (data) setTransactions((prev) => [mapTransaction(data), ...prev]);
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
    if (data) setPayments((prev) => [mapPayment(data), ...prev]);
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
