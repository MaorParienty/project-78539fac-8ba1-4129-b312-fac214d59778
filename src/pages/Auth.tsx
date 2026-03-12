import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { lovable } from "@/integrations/lovable/index";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { Wallet } from "lucide-react";

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

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary px-4" dir="rtl">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              <span className="text-primary">קנסו</span>{" "}
              <span className="text-muted-foreground font-normal text-xl">פיננסים</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              {mode === "login" ? t.auth.loginSubtitle : mode === "signup" ? t.auth.signupSubtitle : t.auth.forgotSubtitle}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Google Sign In */}
          {mode !== "forgot" && (
            <>
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-background border border-border py-3 rounded-xl text-sm font-medium text-foreground hover:bg-accent transition-all hover:border-primary/30"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {t.auth.googleSignIn}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">{t.auth.orWith}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t.auth.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="email@example.com"
              />
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{t.auth.password}</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 mt-2"
            >
              {submitting
                ? "..."
                : mode === "login"
                ? t.auth.login
                : mode === "signup"
                ? t.auth.signup
                : t.auth.sendReset}
            </button>
          </form>

          <div className="text-center space-y-2 text-sm">
            {mode === "login" && (
              <>
                <button type="button" onClick={() => setMode("forgot")} className="text-primary hover:underline block w-full">
                  {t.auth.forgotPassword}
                </button>
                <p className="text-muted-foreground">
                  {t.auth.noAccount}{" "}
                  <button type="button" onClick={() => setMode("signup")} className="text-primary hover:underline font-medium">
                    {t.auth.signup}
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-muted-foreground">
                {t.auth.hasAccount}{" "}
                <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline font-medium">
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
        </div>
      </div>
    </div>
  );
};

export default Auth;
