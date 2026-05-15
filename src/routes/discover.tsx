import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FreshnessRing } from "@/components/common/FreshnessRing";
import { Search, SlidersHorizontal, Map, List, ShieldCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  component: Discover,
});

const filters = ["Nearby", "Veg only", "Hot now", "Family pack", "Verified"];

const items = [
  { id: 1, name: "Veg Thali", donor: "Annapurna Kitchen", verified: true, dist: 0.6, fresh: 94, emoji: "🍱" },
  { id: 2, name: "Banquet Leftovers", donor: "Sai Hall", verified: true, dist: 1.2, fresh: 76, emoji: "🍛" },
  { id: 3, name: "Fresh Sandwiches", donor: "Café Bloom", verified: false, dist: 2.0, fresh: 88, emoji: "🥪" },
  { id: 4, name: "Mixed Sweets", donor: "Mehta Family", verified: false, dist: 0.9, fresh: 52, emoji: "🍬" },
];

function Discover() {
  const [view, setView] = useState<"list" | "map">("list");
  const [active, setActive] = useState<string[]>([]);

  const toggle = (f: string) =>
    setActive((a) => (a.includes(f) ? a.filter((x) => x !== f) : [...a, f]));

  return (
    <AppLayout title="Discover">
      <div className="p-4 pb-24 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search dishes, donors..." className="h-11 rounded-xl pl-9" />
          </div>
          <button className="h-11 w-11 rounded-xl border grid place-items-center">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => toggle(f)}
              className={cn(
                "px-3 h-8 rounded-full border text-xs font-medium whitespace-nowrap",
                active.includes(f) ? "border-primary bg-primary/10 text-primary" : "bg-card"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex p-1 rounded-xl bg-secondary text-sm font-medium">
          <button
            onClick={() => setView("list")}
            className={`flex-1 h-9 rounded-lg flex items-center justify-center gap-1 ${view === "list" ? "bg-background shadow-[var(--shadow-card)]" : "text-muted-foreground"}`}
          >
            <List className="h-4 w-4" /> List
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex-1 h-9 rounded-lg flex items-center justify-center gap-1 ${view === "map" ? "bg-background shadow-[var(--shadow-card)]" : "text-muted-foreground"}`}
          >
            <Map className="h-4 w-4" /> Map
          </button>
        </div>

        {view === "map" ? (
          <Card className="aspect-square grid place-items-center bg-gradient-to-br from-secondary to-primary/10 text-muted-foreground text-sm">
            <div className="text-center">
              <MapPin className="h-6 w-6 mx-auto mb-1 text-primary" />
              Interactive map coming soon
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <Link
                key={it.id}
                to="/food/details/$id"
                params={{ id: String(it.id) }}
                className="block"
              >
                <Card className="p-3 flex gap-3 items-center shadow-[var(--shadow-card)] hover:border-primary/40 transition-colors">
                  <div className="h-16 w-16 rounded-xl bg-secondary grid place-items-center text-2xl shrink-0">
                    {it.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{it.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 truncate">
                      {it.donor}
                      {it.verified && <ShieldCheck className="h-3 w-3 text-success" />}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{it.dist} km away</div>
                  </div>
                  <FreshnessRing value={it.fresh} />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
