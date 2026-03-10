import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  Target,
  BarChart3,
  Settings,
  Sparkles,
  FileText,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { t } from "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: t.nav.dashboard, url: "/", icon: LayoutDashboard },
  { title: t.nav.transactions, url: "/transactions", icon: ArrowLeftRight },
  { title: t.nav.payments, url: "/payments", icon: CreditCard },
  { title: t.nav.budgets, url: "/budgets", icon: Target },
  { title: t.nav.analytics, url: "/analytics", icon: BarChart3 },
];

const aiItems = [
  { title: t.nav.aiAssistant, url: "/ai-assistant", icon: Sparkles },
  { title: t.nav.weeklyReports, url: "/weekly-reports", icon: FileText },
];

const settingsItems = [
  { title: t.nav.settings, url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();

  const renderItems = (items: typeof mainItems) =>
    items.map((item) => {
      const isActive = item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url);
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isActive}>
            <NavLink
              to={item.url}
              end={item.url === "/"}
              className="hover:bg-accent/50 transition-colors"
              activeClassName="bg-accent text-primary font-medium"
            >
              <item.icon className="ms-0 me-3 h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar collapsible="icon" side="right" className="border-s border-border">
      <SidebarContent className="pt-6">
        <div className="px-4 mb-6">
          {!collapsed ? (
            <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              <span className="text-primary">{t.appName}</span>
              <span className="text-muted-foreground font-normal me-1">{t.appSubtitle}</span>
            </h1>
          ) : (
            <span className="text-primary font-heading font-bold text-xl block text-center">ק</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs text-muted-foreground px-4">AI</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(aiItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(settingsItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
