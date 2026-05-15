import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Plus, Bell, User } from "lucide-react";

type Tab = {
  to: string;
  label: string;
  icon: typeof Home;
  primary?: boolean;
};

const tabs: Tab[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Search },
  { to: "/post", label: "Post", icon: Plus, primary: true },
  { to: "/activity", label: "Activity", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="sticky bottom-0 z-30 grid grid-cols-5 border-t bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      {tabs.map(({ to, label, icon: Icon, primary }) => {
        const active = pathname === to;
        if (primary) {
          return (
            <Link
              key={to}
              to={to}
              className="relative flex items-center justify-center"
              aria-label={label}
            >
              <span className="absolute -top-5 h-14 w-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-[var(--shadow-fab)] active:scale-95 transition-transform">
                <Icon className="h-6 w-6" />
              </span>
              <span className="sr-only">{label}</span>
            </Link>
          );
        }
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors ${
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
