import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Bell, CheckCircle2, Truck, AlertTriangle, Heart, Settings } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  component: Notifications,
});

const tabs = ["All", "Bookings", "Volunteer", "Community"] as const;

const items = [
  { id: 1, type: "Bookings", icon: CheckCircle2, color: "text-success bg-success/10", title: "Booking confirmed", body: "Annapurna Kitchen accepted your reservation.", time: "2m", unread: true },
  { id: 2, type: "Volunteer", icon: Truck, color: "text-primary bg-primary/10", title: "Pickup nearby", body: "1.2 km — Mehta Family → Sunshine NGO", time: "10m", unread: true },
  { id: 3, type: "Bookings", icon: AlertTriangle, color: "text-accent bg-accent/10", title: "Pickup reminder", body: "Your meal is ready in 30 minutes.", time: "1h", unread: false },
  { id: 4, type: "Community", icon: Heart, color: "text-destructive bg-destructive/10", title: "Impact milestone!", body: "You've helped 50 people this month. 🎉", time: "Yesterday", unread: false },
];

function Notifications() {
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const list = items.filter((i) => tab === "All" || i.type === tab);

  return (
    <AppLayout title="Notifications">
      <div className="p-4 pb-24 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 h-8 rounded-full text-xs font-medium whitespace-nowrap",
                  tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <Link to="/settings/notifications" aria-label="Settings" className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary">
            <Settings className="h-4 w-4" />
          </Link>
        </div>

        <button className="w-full text-xs text-primary font-medium text-right">Mark all as read</button>

        <div className="space-y-2">
          {list.map((n) => {
            const Icon = n.icon;
            return (
              <Card key={n.id} className={cn("p-3 flex gap-3 shadow-[var(--shadow-card)]", n.unread && "border-primary/30")}>
                <div className={cn("h-10 w-10 rounded-xl grid place-items-center shrink-0", n.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-sm truncate">{n.title}</div>
                    <span className="text-[11px] text-muted-foreground shrink-0">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                </div>
                {n.unread && <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
              </Card>
            );
          })}
          {list.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
              No notifications
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
