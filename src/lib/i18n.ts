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
    subtitle: "ניהול חשבון והעדפות",
    monthlyBudget: "תקציב חודשי",
    save: "שמור",
    saved: "נשמר בהצלחה",
    profile: "פרטי משתמש",
    displayName: "שם תצוגה",
    account: "חשבון",
    accountDesc: "אימות וסנכרון נתונים.",
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

  // Auth
  auth: {
    login: "התחבר",
    signup: "הרשמה",
    email: "אימייל",
    password: "סיסמה",
    loginSubtitle: "התחבר לחשבון שלך",
    signupSubtitle: "צור חשבון חדש",
    forgotSubtitle: "נשלח לך קישור לאיפוס סיסמה",
    forgotPassword: "שכחת סיסמה?",
    noAccount: "אין לך חשבון?",
    hasAccount: "כבר יש לך חשבון?",
    backToLogin: "חזרה להתחברות",
    sendReset: "שלח קישור איפוס",
    resetSent: "קישור לאיפוס סיסמה נשלח לאימייל שלך",
    confirmEmail: "נשלח אימייל אימות. בדוק את תיבת הדואר שלך.",
    newPassword: "סיסמה חדשה",
    newPasswordLabel: "הזן סיסמה חדשה",
    updatePassword: "עדכן סיסמה",
    passwordUpdated: "הסיסמה עודכנה בהצלחה",
    invalidResetLink: "קישור איפוס לא תקין",
    logout: "התנתק",
    loading: "טוען נתונים...",
    googleSignIn: "המשך עם Google",
    orWith: "או עם אימייל",
  },

  // AI
  ai: {
    title: "יועץ פיננסי AI",
    subtitle: "שאל שאלות על הנתונים הפיננסיים שלך",
    welcome: "שלום! אני היועץ הפיננסי שלך",
    welcomeDesc: "אני יכול לנתח את הנתונים שלך, לזהות דפוסי הוצאות, ולעזור לך לקבל החלטות פיננסיות חכמות יותר.",
    inputPlaceholder: "שאל שאלה...",
    insightsTitle: "תובנות AI",
    refresh: "רענן",
    analyzing: "מנתח...",
    noInsights: "אין תובנות כרגע",
    weeklyTitle: "דוחות שבועיים",
    weeklySubtitle: "סיכום AI של הפעילות הפיננסית שלך",
    generateReport: "צור דוח",
    regenerate: "צור מחדש",
    generating: "מייצר...",
    generatingReport: "מייצר דוח שבועי מותאם אישית...",
    noReportYet: "עדיין אין דוח שבועי",
    noReportDesc: "לחץ על הכפתור למטה כדי ליצור דוח שבועי מותאם אישית המבוסס על הנתונים הפיננסיים שלך.",
    weeklyInsightsTitle: "תובנות שבועיות",
  },
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
