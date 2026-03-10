import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `אתה יועץ פיננסי אישי חכם בשם "קנסו AI". אתה מדבר בעברית בלבד.

תפקידך:
- לנתח את הנתונים הפיננסיים של המשתמש ולספק תובנות ועצות
- לענות על שאלות לגבי הרגלי הוצאות, תקציבים ומגמות פיננסיות
- לזהות דפוסי הוצאות חריגים
- להציע דרכים לחסוך ולשפר את הבריאות הפיננסית
- לסכם מצב פיננסי בצורה ברורה וקלה להבנה

כללים:
- תמיד ענה בעברית
- השתמש בסימן ₪ עבור סכומים בשקלים
- היה קצר וממוקד, אלא אם המשתמש מבקש פירוט
- ספק נתונים מדויקים מתוך המידע שקיבלת
- אם אין לך מספיק מידע, ציין זאת בכנות
- השתמש בפורמט מרקדאון לתשובות מובנות (כותרות, רשימות, טבלאות)
- היה חיובי ומעודד אך ריאלי

הנתונים הפיננסיים של המשתמש יסופקו בהודעה הראשונה של כל שיחה.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, financialContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build messages with financial context injected as first user context
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (financialContext) {
      aiMessages.push({
        role: "user",
        content: `הנה הנתונים הפיננסיים שלי (השתמש בהם לניתוח, אל תציג אותם כפי שהם):\n\n${financialContext}`,
      });
      aiMessages.push({
        role: "assistant",
        content: "קיבלתי את הנתונים הפיננסיים שלך. אני מוכן לעזור! מה תרצה לדעת?",
      });
    }

    // Add conversation messages
    if (messages && Array.isArray(messages)) {
      aiMessages.push(...messages);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "יותר מדי בקשות, נסה שוב בעוד כמה דקות." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "נדרש תשלום, אנא הוסף קרדיטים לחשבון." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "שגיאה בשירות AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "שגיאה לא ידועה" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
