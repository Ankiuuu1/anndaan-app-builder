import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { FreshnessRing } from "@/components/common/FreshnessRing";
import { Pencil, Trash2, Plus, Bell } from "lucide-react";

export const Route = createFileRoute("/food/posted")({
  component: PostedFood,
});

const items = [
  { id: 1, name: "Veg Biryani", serves: 4, fresh: 92, requests: 2 },
  { id: 2, name: "Pav Bhaji", serves: 6, fresh: 64, requests: 5 },
  { id: 3, name: "Mixed Sweets", serves: 8, fresh: 38, requests: 1 },
];

function PostedFood() {
  const [tab, setTab] = useState<"active" | "history">("active");
  return (
    <AppLayout title="My Donations">
      <div className="p-4 pb-28">
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
          {items.map((it) => (
            <Card key={it.id} className="p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-secondary grid place-items-center text-2xl">🍛</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{it.name}</div>
                  <div className="text-xs text-muted-foreground">Serves {it.serves}</div>
                  {it.requests > 0 && (
                    <div className="mt-1 inline-flex items-center gap-1 text-xs text-accent font-medium">
                      <Bell className="h-3 w-3" /> {it.requests} new requests
                    </div>
                  )}
                </div>
                <FreshnessRing value={it.fresh} label="fresh" />
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 h-9 rounded-lg border text-sm font-medium flex items-center justify-center gap-1 hover:bg-secondary">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button className="flex-1 h-9 rounded-lg border border-destructive/30 text-destructive text-sm font-medium flex items-center justify-center gap-1 hover:bg-destructive/5">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </Card>
          ))}
        </div>

        <Link
          to="/post"
          className="fixed bottom-24 right-1/2 translate-x-[218px] z-20 h-14 w-14 rounded-full bg-accent text-accent-foreground grid place-items-center shadow-[var(--shadow-fab)]"
          aria-label="Post new food"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </AppLayout>
  );
}
