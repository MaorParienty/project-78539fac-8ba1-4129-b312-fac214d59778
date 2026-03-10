import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const REPORT_PROMPT = `אתה יועץ פיננסי בשם "קנסו AI". צור דוח שבועי מפורט בעברית בהתבסס על הנתונים הפיננסיים.

הדוח צריך לכלול:
1. **סיכום שבועי** - סה"כ הכנסות, הוצאות, ותוצאה נטו לשבוע
2. **קטגוריות מובילות** - הקטגוריות עם ההוצאה הגבוהה ביותר
3. **שינויים בולטים** - השוואה לשבוע הקודם (אם יש נתונים)
4. **תנועות חריגות** - תנועות גדולות או יוצאות דופן
5. **סטטוס תקציב** - התקדמות מול התקציב החודשי
6. **תשלומים קרובים** - תשלומים שמתוכננים לשבוע הבא
7. **תובנות AI** - 3-4 תובנות מותאמות אישית

השתמש בפורמט מרקדאון עם כותרות, רשימות וטבלאות. השתמש בסימן ₪ עבור סכומים.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { financialContext, weekRange } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = weekRange
      ? `הנתונים הפיננסיים שלי לשבוע ${weekRange}:\n\n${financialContext}`
      : `הנתונים הפיננסיים שלי:\n\n${financialContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: REPORT_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "יותר מדי בקשות" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "נדרש תשלום" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI report error:", response.status, t);
      return new Response(JSON.stringify({ error: "שגיאה בשירות AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const report = data.choices?.[0]?.message?.content || "לא ניתן ליצור דוח כרגע.";

    return new Response(JSON.stringify({ report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "שגיאה" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
