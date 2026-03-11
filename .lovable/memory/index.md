Kanso Finance — Hebrew RTL personal finance app with Heebo/Rubik fonts, blue primary accent, ILS currency.

## Design tokens
- Primary/accent: Blue (225 65% 52%) — LIGHT ONLY, no dark mode
- Success/income: Teal Green (160 84% 39%)
- Destructive/expense: Red (0 84% 60%)
- Background: Near-white (0 0% 98%)
- Card: Pure white (0 0% 100%)
- No drop shadows per design brief
- No dark mode — user must NOT have theme toggle
- Font heading: Heebo, font body: Rubik (Hebrew-supporting)
- Border radius: 0.75rem (rounded-xl on cards)

## Language & Layout
- Hebrew (RTL) — all UI text in Hebrew via src/lib/i18n.ts
- dir="rtl" on html and body
- Currency: ILS (₪), locale: he-IL
- Charts use dir="ltr" for correct rendering

## Architecture
- Context-based state: src/context/FinanceContext.tsx
- Database: Supabase tables — transactions, payments, budgets, categories, profiles
- All tables have RLS policies scoped to auth.uid() = user_id
- Pages: Dashboard, Transactions, Payments, Budgets, Analytics, AI Assistant, Weekly Reports, Settings
- Sidebar nav on RIGHT side (RTL), collapsible icon mode with AI section

## Auth
- Email/password + Google OAuth (via @lovable.dev/cloud-auth-js)
- Floating AI chat in bottom-left corner (FloatingChat component)

## AI Features
- 3 edge functions: ai-chat (streaming), ai-insights (structured JSON), ai-weekly-report
- Uses Lovable AI gateway (google/gemini-3-flash-preview)
- Financial context builder: src/lib/financial-context.ts
- Streaming chat: src/lib/ai-stream.ts
- Dashboard has AIInsightsCard component

## Pending features
- Shared accounts (two users) with realtime sync
- Currency conversion with Bank of Israel API
- Account linking via invite email + share code
