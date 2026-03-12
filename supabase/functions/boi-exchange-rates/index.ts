import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch from Bank of Israel API
    const boiUrl = "https://www.boi.org.il/PublicApi/GetExchangeRates?asXml=false&lang=en";
    const boiResp = await fetch(boiUrl);

    if (!boiResp.ok) {
      throw new Error(`BOI API returned ${boiResp.status}`);
    }

    const boiData = await boiResp.json();
    const rates: { currency_code: string; rate_to_ils: number }[] = [];

    // BOI returns exchangeRates array
    const exchangeRates = boiData?.exchangeRates || boiData?.ExchangeRates || [];
    for (const rate of exchangeRates) {
      const code = rate.key || rate.Key || rate.currencyCode;
      const value = rate.currentExchangeRate || rate.CurrentExchangeRate || rate.rate;
      const unit = rate.unit || rate.Unit || 1;
      if (code && value) {
        rates.push({
          currency_code: code.toUpperCase(),
          rate_to_ils: Number(value) / Number(unit),
        });
      }
    }

    // Upsert into exchange_rates table
    if (rates.length > 0) {
      for (const r of rates) {
        await supabase
          .from("exchange_rates")
          .upsert(
            { currency_code: r.currency_code, rate_to_ils: r.rate_to_ils, last_updated: new Date().toISOString() },
            { onConflict: "currency_code" }
          );
      }
    }

    // Return current rates
    const { data: allRates } = await supabase
      .from("exchange_rates")
      .select("*")
      .order("currency_code");

    return new Response(JSON.stringify({ rates: allRates || rates, updated: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("BOI rates error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
