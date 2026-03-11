import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FloatingChat } from "@/components/chat/FloatingChat";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background" dir="rtl">
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-end border-b border-border px-4 lg:px-8 shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-8 pb-24">
            {children}
          </main>
        </div>
        <AppSidebar />
        <FloatingChat />
      </div>
    </SidebarProvider>
  );
}
