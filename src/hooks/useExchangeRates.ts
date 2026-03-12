import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ExchangeRate {
  currency_code: string;
  rate_to_ils: number;
  last_updated: string;
}

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // First try to get cached rates
      const { data } = await supabase.from("exchange_rates").select("*");
      if (data && data.length > 0) {
        setRates(data.map((r) => ({
          currency_code: r.currency_code,
          rate_to_ils: Number(r.rate_to_ils),
          last_updated: r.last_updated,
        })));
      }

      // Refresh rates from BOI in background
      try {
        const resp = await supabase.functions.invoke("boi-exchange-rates");
        if (resp.data?.rates) {
          setRates(resp.data.rates.map((r: any) => ({
            currency_code: r.currency_code,
            rate_to_ils: Number(r.rate_to_ils),
            last_updated: r.last_updated,
          })));
        }
      } catch {
        // Use cached rates
      }
      setLoading(false);
    };
    load();
  }, []);

  const convertToILS = (amount: number, currencyCode: string): number | null => {
    if (currencyCode === "ILS") return amount;
    const rate = rates.find((r) => r.currency_code === currencyCode);
    if (!rate) return null;
    return amount * rate.rate_to_ils;
  };

  const getRate = (currencyCode: string): number | null => {
    const rate = rates.find((r) => r.currency_code === currencyCode);
    return rate ? rate.rate_to_ils : null;
  };

  return { rates, loading, convertToILS, getRate };
}
