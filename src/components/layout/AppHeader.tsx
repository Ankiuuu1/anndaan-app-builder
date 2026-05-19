import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";


interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "AnnDaan" }: AppHeaderProps) {
  const { user } = useAuth();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications-count", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .is("read_at", null);
      if (error) throw error;
      return count ?? 0;
    },
  });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-background/90 backdrop-blur px-4 h-14 border-b">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">
          A
        </div>
        <span className="font-bold text-base tracking-tight">{title}</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          to="/notifications"
          className="relative h-10 w-10 grid place-items-center rounded-full hover:bg-secondary"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-accent text-[10px] font-bold text-accent-foreground grid place-items-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        <Link to="/profile" aria-label="Profile">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              U
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
