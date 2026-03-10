import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { t } from "@/lib/i18n";
import { toast } from "sonner";

const Auth = () => {
  const { user, loading, signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="animate-pulse text-muted-foreground">טוען...</div>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "forgot") {
      const { error } = await resetPassword(email);
      if (error) toast.error(error.message);
      else toast.success(t.auth.resetSent);
      setSubmitting(false);
      return;
    }

    const fn = mode === "login" ? signIn : signUp;
    const { error } = await fn(email, password);
    if (error) {
      toast.error(error.message);
    } else if (mode === "signup") {
      toast.success(t.auth.confirmEmail);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4" dir="rtl">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            <span className="text-primary">קנסו</span>{" "}
            <span className="text-muted-foreground font-normal">פיננסים</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {mode === "login" ? t.auth.loginSubtitle : mode === "signup" ? t.auth.signupSubtitle : t.auth.forgotSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t.auth.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="email@example.com"
            />
          </div>

          {mode !== "forgot" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t.auth.password}</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting
              ? "..."
              : mode === "login"
              ? t.auth.login
              : mode === "signup"
              ? t.auth.signup
              : t.auth.sendReset}
          </button>

          <div className="text-center space-y-2 text-sm">
            {mode === "login" && (
              <>
                <button type="button" onClick={() => setMode("forgot")} className="text-primary hover:underline block w-full">
                  {t.auth.forgotPassword}
                </button>
                <p className="text-muted-foreground">
                  {t.auth.noAccount}{" "}
                  <button type="button" onClick={() => setMode("signup")} className="text-primary hover:underline">
                    {t.auth.signup}
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-muted-foreground">
                {t.auth.hasAccount}{" "}
                <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline">
                  {t.auth.login}
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline">
                {t.auth.backToLogin}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
