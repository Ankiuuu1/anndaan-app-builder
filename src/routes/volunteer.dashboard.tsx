import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Link } from "@tanstack/react-router";
import { Star, AlertTriangle, MapPin, Clock, Bike } from "lucide-react";

export const Route = createFileRoute("/volunteer/dashboard")({
  component: VolunteerDashboard,
});

const requests = [
  { id: 1, food: "Mixed Sweets", from: "Mehta Family", to: "Sunshine NGO", dist: 1.2, window: "30 min", level: "Easy" },
  { id: 2, food: "Banquet Leftovers", from: "Sai Hall", to: "Hope Shelter", dist: 3.5, window: "1 hour", level: "Medium" },
];

function VolunteerDashboard() {
  const [available, setAvailable] = useState(true);
  return (
    <AppLayout title="Volunteer">
      <div className="p-4 pb-24 space-y-5">
        <Card className="p-4 flex items-center gap-3 shadow-[var(--shadow-card)]">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
            <Bike className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Available for pickups</div>
            <div className="text-xs text-muted-foreground">Toggle off to stop receiving requests</div>
          </div>
          <Switch checked={available} onCheckedChange={setAvailable} />
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {[
            { v: "42", l: "Pickups" },
            { v: "4.8★", l: "Rating" },
            { v: "120kg", l: "Saved" },
          ].map((s) => (
            <Card key={s.l} className="p-3 text-center shadow-[var(--shadow-card)]">
              <div className="text-lg font-bold text-primary">{s.v}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{s.l}</div>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">Pickup requests near you</h3>
          <div className="space-y-3">
            {requests.map((r) => (
              <Link key={r.id} to="/volunteer/requests" search={{ id: r.id }} className="block">
                <Card className="p-4 shadow-[var(--shadow-card)] hover:border-primary/40">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{r.food}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        From {r.from} → {r.to}
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary">{r.level}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.dist} km</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> within {r.window}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 h-9 rounded-lg border text-sm font-medium">Decline</button>
                    <button className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Accept</button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Link
          to="/safety/emergency"
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-destructive text-destructive-foreground font-semibold shadow-[var(--shadow-card)]"
        >
          <AlertTriangle className="h-5 w-5" /> Emergency · Panic button
        </Link>

        <Card className="p-4 flex items-center gap-3 shadow-[var(--shadow-card)]">
          <Star className="h-4 w-4 text-accent" />
          <div className="text-xs text-muted-foreground">
            Maintain a 4.5+ rating to unlock express pickups in your zone.
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
