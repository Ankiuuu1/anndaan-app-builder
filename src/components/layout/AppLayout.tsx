import { ReactNode } from "react";
import { MobileShell } from "./MobileShell";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
}

export function AppLayout({
  children,
  title,
  showHeader = true,
  showBottomNav = true,
}: AppLayoutProps) {
  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        {showHeader && <AppHeader title={title} />}
        <main className="flex-1 overflow-y-auto">{children}</main>
        {showBottomNav && <BottomNav />}
      </div>
    </MobileShell>
  );
}
