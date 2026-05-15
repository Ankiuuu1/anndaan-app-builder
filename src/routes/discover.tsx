import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FreshnessRing } from "@/components/common/FreshnessRing";
import { Search, MapPin } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentLocation } from "@/lib/api";

export const Route = createFileRoute("/discover")({
  component: Discover,
});

function Discover() {
  useRequireAuth();
  const [search, setSearch] = useState("");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getCurrentLocation().then(setLoc);
  }, []);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["nearby-food", loc?.lat, loc?.lng],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("nearby_food", {
        _lat: loc?.lat ?? null,
        _lng: loc?.lng ?? null,
        _radius_km: 25,
      });
      if (error) throw error;
      return data;
    },
  });

  const filtered = items.filter((i) => !search || i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout title="Discover">
      <div className="p-4 pb-24 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes, donors..." className="h-11 rounded-xl pl-9" />
        </div>

        {!loc && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Enable location for better matches
          </p>
        )}

        {isLoading && <p className="text-center text-sm text-muted-foreground py-12">Loading nearby food...</p>}
        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">No food available nearby right now.</p>
        )}

        <div className="space-y-3">
          {filtered.map((it) => (
            <Link key={it.id} to="/food/details/$id" params={{ id: it.id }} className="block">
              <Card className="p-3 flex gap-3 items-center shadow-[var(--shadow-card)] hover:border-primary/40 transition-colors">
                <div className="h-16 w-16 rounded-xl bg-secondary grid place-items-center text-2xl shrink-0 overflow-hidden">
                  {it.photo_url ? <img src={it.photo_url} alt="" className="w-full h-full object-cover" /> : "🍱"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{it.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{it.pickup_address}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {it.distance_km != null ? `${it.distance_km.toFixed(1)} km away` : "Distance unknown"}
                  </div>
                </div>
                <FreshnessRing value={it.freshness ?? 0} />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
