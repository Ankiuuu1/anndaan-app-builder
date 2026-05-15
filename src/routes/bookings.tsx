import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Truck } from "lucide-react";

export const Route = createFileRoute("/bookings")({
  component: Bookings,
});

const data = {
  active: [
    { id: 1, name: "Veg Thali", donor: "Annapurna Kitchen", status: "Confirmed", icon: Clock, time: "Today · 6:30 PM" },
    { id: 2, name: "Pav Bhaji", donor: "Sai Hall", status: "Ready", icon: Truck, time: "Today · 7:00 PM" },
  ],
  history: [
    { id: 3, name: "Sandwiches", donor: "Café Bloom", status: "Picked up", icon: CheckCircle2, time: "Yesterday" },
  ],
};

const statusStyles: Record<string, string> = {
  Confirmed: "bg-accent/15 text-accent",
  Ready: "bg-success/15 text-success",
  "Picked up": "bg-secondary text-muted-foreground",
};

function Bookings() {
  const [tab, setTab] = useState<"active" | "history">("active");
  const list = data[tab];
  return (
    <AppLayout title="My Bookings">
      <div className="p-4 pb-24">
        <div className="flex p-1 rounded-xl bg-secondary text-sm font-medium">
          {(["active", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 h-9 rounded-lg capitalize ${tab === t ? "bg-background shadow-[var(--shadow-card)]" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {list.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.id} className="p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-secondary grid place-items-center text-2xl">🍱</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.donor}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon className="h-3 w-3" /> {b.time}
                    </div>
                  </div>
                  <Badge className={statusStyles[b.status] ?? ""} variant="secondary">
                    {b.status}
                  </Badge>
                </div>
                {tab === "active" && (
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 h-9 rounded-lg border text-sm font-medium hover:bg-secondary">
                      Directions
                    </button>
                    <button className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                      Mark picked up
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
          {list.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-12">No {tab} bookings.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
