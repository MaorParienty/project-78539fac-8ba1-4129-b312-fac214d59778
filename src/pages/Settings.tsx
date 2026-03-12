import { useFinance } from "@/context/FinanceContext";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { User, Mail, CreditCard, Save, Users, Copy, LogIn, Trash2, UserMinus } from "lucide-react";

interface SharedAccount {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  members: { user_id: string; role: string; display_name?: string }[];
}

const Settings = () => {
  const { monthlyBudget, setMonthlyBudget } = useFinance();
  const { user } = useAuth();
  const [budget, setBudget] = useState(monthlyBudget.toString());
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharedAccount, setSharedAccount] = useState<SharedAccount | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [sharedLoading, setSharedLoading] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.display_name) setDisplayName(data.display_name);
        });
      loadSharedAccount();
    }
  }, [user]);

  const loadSharedAccount = async () => {
    if (!user) return;
    // Check if user is part of any shared account
    const { data: memberships } = await supabase
      .from("shared_account_members")
      .select("account_id, role")
      .eq("user_id", user.id);

    if (memberships && memberships.length > 0) {
      const accountId = memberships[0].account_id;
      const { data: account } = await supabase
        .from("shared_accounts")
        .select("*")
        .eq("id", accountId)
        .single();

      if (account) {
        const { data: members } = await supabase
          .from("shared_account_members")
          .select("user_id, role")
          .eq("account_id", accountId);

        // Get display names for members
        const memberDetails = [];
        for (const m of members || []) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("user_id", m.user_id)
            .single();
          memberDetails.push({ ...m, display_name: profile?.display_name || m.user_id.slice(0, 8) });
        }

        setSharedAccount({
          id: account.id,
          name: account.name,
          invite_code: account.invite_code,
          created_by: account.created_by,
          members: memberDetails,
        });
      }
    } else {
      setSharedAccount(null);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", user.id);
    if (error) toast.error(error.message);
    else toast.success(t.settings.saved);
    setLoading(false);
  };

  const handleSaveBudget = () => {
    const val = parseFloat(budget);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
      toast.success(t.settings.saved);
    }
  };

  const handleCreateShared = async () => {
    if (!user) return;
    setSharedLoading(true);
    const { data, error } = await supabase
      .from("shared_accounts")
      .insert({ created_by: user.id })
      .select()
      .single();

    if (error) { toast.error(error.message); setSharedLoading(false); return; }

    // Add creator as owner member
    await supabase.from("shared_account_members").insert({
      account_id: data.id,
      user_id: user.id,
      role: "owner",
    });

    toast.success(t.settings.accountCreated);
    await loadSharedAccount();
    setSharedLoading(false);
  };

  const handleJoinByCode = async () => {
    if (!user || !joinCode.trim()) return;
    setSharedLoading(true);

    const { data: account } = await supabase
      .from("shared_accounts")
      .select("id")
      .eq("invite_code", joinCode.trim())
      .single();

    if (!account) {
      toast.error(t.settings.invalidCode);
      setSharedLoading(false);
      return;
    }

    const { error } = await supabase.from("shared_account_members").insert({
      account_id: account.id,
      user_id: user.id,
      role: "member",
    });

    if (error) toast.error(error.message);
    else {
      toast.success(t.settings.joinedAccount);
      setJoinCode("");
      await loadSharedAccount();
    }
    setSharedLoading(false);
  };

  const handleLeave = async () => {
    if (!user || !sharedAccount) return;
    setSharedLoading(true);
    await supabase
      .from("shared_account_members")
      .delete()
      .eq("account_id", sharedAccount.id)
      .eq("user_id", user.id);

    toast.success(t.settings.leftAccount);
    setSharedAccount(null);
    setSharedLoading(false);
  };

  const handleDeleteShared = async () => {
    if (!user || !sharedAccount) return;
    setSharedLoading(true);
    await supabase.from("shared_accounts").delete().eq("id", sharedAccount.id);
    toast.success(t.settings.deletedAccount);
    setSharedAccount(null);
    setSharedLoading(false);
  };

  const copyInviteCode = () => {
    if (sharedAccount) {
      navigator.clipboard.writeText(sharedAccount.invite_code);
      toast.success(t.settings.codeCopied);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{t.settings.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t.settings.subtitle}</p>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-4 w-4 text-primary" />
          <h2 className="font-heading text-sm font-semibold text-foreground">{t.settings.profile}</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.auth.email}</label>
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.settings.displayName}</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {t.settings.save}
          </button>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="h-4 w-4 text-primary" />
          <h2 className="font-heading text-sm font-semibold text-foreground">{t.settings.monthlyBudget}</h2>
        </div>
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            step="100"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button
            onClick={handleSaveBudget}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all"
          >
            <Save className="h-4 w-4" />
            {t.settings.save}
          </button>
        </div>
      </div>

      {/* Shared Account */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="font-heading text-sm font-semibold text-foreground">{t.settings.sharedAccount}</h2>
        </div>
        <p className="text-xs text-muted-foreground">{t.settings.sharedAccountDesc}</p>

        {sharedAccount ? (
          <div className="space-y-4">
            {/* Invite code */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t.settings.yourCode}</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono text-foreground tracking-widest">
                  {sharedAccount.invite_code}
                </div>
                <button
                  onClick={copyInviteCode}
                  className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/80 transition-all"
                >
                  <Copy className="h-4 w-4" />
                  {t.settings.copyCode}
                </button>
              </div>
            </div>

            {/* Members list */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">{t.settings.sharedWith}</label>
              <div className="space-y-2">
                {sharedAccount.members.map((m) => (
                  <div key={m.user_id} className="flex items-center justify-between bg-background border border-border rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{m.display_name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{m.role === "owner" ? "בעלים" : "חבר"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave / Delete */}
            <div className="flex gap-2 pt-2">
              {sharedAccount.created_by === user?.id ? (
                <button
                  onClick={handleDeleteShared}
                  disabled={sharedLoading}
                  className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-destructive/20 transition-all disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {t.settings.deleteShared}
                </button>
              ) : (
                <button
                  onClick={handleLeave}
                  disabled={sharedLoading}
                  className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-destructive/20 transition-all disabled:opacity-50"
                >
                  <UserMinus className="h-4 w-4" />
                  {t.settings.leaveShared}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">{t.settings.noSharedAccount}</p>

            {/* Create */}
            <button
              onClick={handleCreateShared}
              disabled={sharedLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <Users className="h-4 w-4" />
              {t.settings.createShared}
            </button>

            {/* Join by code */}
            <div className="border-t border-border pt-4 space-y-2">
              <label className="text-xs text-muted-foreground block">{t.settings.joinByCode}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder={t.settings.inviteCode}
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  onClick={handleJoinByCode}
                  disabled={sharedLoading || !joinCode.trim()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  <LogIn className="h-4 w-4" />
                  {t.settings.joinByCode}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
