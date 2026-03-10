// Hebrew translations and locale utilities

export const t = {
  // App
  appName: "קנסו",
  appSubtitle: "פיננסים",

  // Navigation
  nav: {
    dashboard: "לוח בקרה",
    transactions: "תנועות",
    payments: "תשלומים",
    budgets: "תקציבים",
    analytics: "ניתוח",
    settings: "הגדרות",
    aiAssistant: "יועץ AI",
    weeklyReports: "דוחות שבועיים",
  },

  // Dashboard
  dashboard: {
    title: "לוח בקרה",
    subtitle: "סקירה חודשית",
    currentBalance: "יתרה נוכחית",
    monthlyIncome: "הכנסה חודשית",
    monthlyExpenses: "הוצאות חודשיות",
    remainingBudget: "תקציב נותר",
    expenseDistribution: "התפלגות הוצאות",
    incomeVsExpenses: "הכנסות מול הוצאות",
    recentTransactions: "תנועות אחרונות",
    upcomingPayments: "תשלומים קרובים",
    income: "הכנסה",
    expenses: "הוצאות",
  },

  // Transactions
  transactions: {
    title: "תנועות",
    count: (n: number) => `${n} תנועות`,
    addTransaction: "הוסף תנועה",
    editTransaction: "ערוך תנועה",
    searchPlaceholder: "חפש תנועות...",
    all: "הכל",
    income: "הכנסה",
    expense: "הוצאה",
    date: "תאריך",
    description: "תיאור",
    category: "קטגוריה",
    amount: "סכום",
    notes: "הערות",
    optionalNotes: "תיאור אופציונלי",
    update: "עדכן",
    add: "הוסף",
    noDescription: "—",
  },

  // Payments
  payments: {
    title: "תשלומים",
    subtitle: "ניהול תשלומים חוזרים ומתוכננים",
    addPayment: "הוסף תשלום",
    upcoming: "קרובים",
    paid: "שולמו",
    noUpcoming: "אין תשלומים קרובים",
    name: "שם",
    type: "סוג",
    dueDate: "תאריך יעד",
    recurring: "חוזר",
    oneTime: "חד פעמי",
    scheduled: "מתוכנן",
  },

  // Budgets
  budgets: {
    title: "תקציבים",
    overallBudget: "תקציב כולל",
    warning: (pct: number) => `⚠ השתמשת ב-${pct}% מהתקציב החודשי`,
  },

  // Analytics
  analytics: {
    title: "ניתוח",
    subtitle: "תובנות ומגמות הוצאות",
    totalSpending: "סך הוצאות",
    largestCategory: "קטגוריה גדולה",
    dailyAverage: "ממוצע יומי",
    byCategory: "לפי קטגוריה",
    dailySpending: "הוצאות יומיות",
    monthlyComparison: "השוואה חודשית",
  },

  // Settings
  settings: {
    title: "הגדרות",
    subtitle: "ניהול העדפות",
    monthlyBudget: "תקציב חודשי",
    save: "שמור",
    account: "חשבון",
    accountDesc: "אימות וסנכרון נתונים יהיו זמינים בקרוב.",
    exportData: "ייצוא נתונים",
    exportDesc: "ייצוא נתונים יהיה זמין בעדכון עתידי.",
  },

  // Categories
  categories: {
    Food: "אוכל",
    Housing: "דיור",
    Transportation: "תחבורה",
    Entertainment: "בידור",
    Utilities: "חשבונות",
    Health: "בריאות",
    Shopping: "קניות",
    Salary: "משכורת",
    Freelance: "פרילנס",
    Investment: "השקעות",
    Other: "אחר",
  } as Record<string, string>,

  // Common
  toggleTheme: "החלף ערכת נושא",
};

// Format currency in ILS
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date in Hebrew
export const formatDateHe = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "short",
  }).format(date);
};

export const formatDateFullHe = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

// Hebrew month names
export const hebrewMonths = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

// Translate category name
export const translateCategory = (cat: string): string => {
  return t.categories[cat] || cat;
};
