import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { store } from "@/lib/store";

export function AdminLayout({ children }: { children: ReactNode }) {
  if (!store.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Admin</span>
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                A
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
