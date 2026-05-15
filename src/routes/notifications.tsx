import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/notifications")({
  component: Notifications,
});

function Notifications() {
  useRequireAuth();
  useRealtimeNotifications();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: list = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("notifications").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(50);
      return data ?? [];
    },
  });

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user.id).is("read_at", null);
    qc.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <AppLayout title="Notifications">
      <div className="p-4 pb-24 space-y-3">
        <div className="flex items-center justify-between">
          <button onClick={markAllRead} className="text-xs text-primary font-medium">Mark all as read</button>
          <Link to="/settings/notifications" className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary">
            <Settings className="h-4 w-4" />
          </Link>
        </div>

        {list.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
            No notifications yet
          </div>
        )}

        {list.map((n) => (
          <Card key={n.id} className={cn("p-3 flex gap-3 shadow-[var(--shadow-card)]", !n.read_at && "border-primary/30")}>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-sm truncate">{n.title}</div>
                <span className="text-[11px] text-muted-foreground shrink-0">{new Date(n.created_at).toLocaleDateString()}</span>
              </div>
              {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
            </div>
            {!n.read_at && <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
