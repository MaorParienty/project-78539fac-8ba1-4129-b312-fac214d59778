Kanso Finance — Hebrew RTL personal finance app with Heebo/Rubik fonts, gold-orange accent, ILS currency.

## Design tokens
- Primary/accent: Gold-orange (32 95% 44%) — LIGHT ONLY, no dark mode
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
- Database: Supabase tables — transactions, payments, budgets, categories, profiles, shared_accounts, shared_account_members, exchange_rates
- All tables have RLS policies using can_access_user_data() security definer for shared access
- Pages: Dashboard, Transactions, Payments, Budgets, Analytics, AI Assistant, Weekly Reports, Settings
- Sidebar nav on RIGHT side (RTL), collapsible icon mode with AI section
- Realtime subscriptions on transactions, payments, budgets for shared account sync

## Auth
- Email/password + Google OAuth (via @lovable.dev/cloud-auth-js)
- Floating AI chat in bottom-left corner (FloatingChat component)

## Shared Accounts
- shared_accounts table with invite_code for joining
- shared_account_members links users with roles (owner/member)
- RLS uses can_access_user_data() to allow shared data access
- Join by code or invite email

## Currency
- Bank of Israel API via boi-exchange-rates edge function
- exchange_rates table caches rates
- useExchangeRates hook with convertToILS()

## Removed features
- "Remaining budget" card removed from dashboard (was 4th summary card)
