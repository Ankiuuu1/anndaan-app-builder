import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, MapPin, Clock } from "lucide-react";
import { FreshnessRing } from "@/components/common/FreshnessRing";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { freshnessFromDates, timeUntil } from "@/lib/api";

export const Route = createFileRoute("/food/details/$id")({
  component: FoodDetails,
});

function FoodDetails() {
  useRequireAuth();
  const { id } = Route.useParams();

  const { data: food, isLoading } = useQuery({
    queryKey: ["food", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("food_items").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: donor } = useQuery({
    queryKey: ["donor", food?.donor_id],
    enabled: !!food?.donor_id,
    queryFn: async () => {
      const { data } = await supabase.rpc("get_public_profile", { _user_id: food!.donor_id }).maybeSingle();
      return data;
    },
  });

  if (isLoading) return <MobileShell><p className="p-12 text-center text-sm text-muted-foreground">Loading...</p></MobileShell>;
  if (!food) return <MobileShell><p className="p-12 text-center text-sm text-muted-foreground">Food not found</p></MobileShell>;

  const fresh = freshnessFromDates(food.prepared_at, food.expires_at);
  const initial = (donor?.full_name || "?").charAt(0).toUpperCase();

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen pb-24">
        <ScreenHeader title="Food details" />
        <div className="aspect-[4/3] bg-gradient-to-br from-accent/30 to-primary/20 grid place-items-center text-7xl overflow-hidden">
          {food.photo_url ? <img src={food.photo_url} alt={food.title} className="w-full h-full object-cover" /> : "🍱"}
        </div>

        <div className="p-4 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{food.title}</h2>
                {food.description && <p className="text-sm text-muted-foreground">{food.description}</p>}
              </div>
              <FreshnessRing value={fresh} label="fresh" size={64} />
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Best within {timeUntil(food.expires_at)}</span>
              <span>· Serves {food.quantity_servings}</span>
            </div>
          </div>

          <div className="rounded-2xl border p-3 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initial}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 font-semibold">
                {donor?.full_name || "Anonymous donor"}
                {donor?.verified && <ShieldCheck className="h-4 w-4 text-success" />}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" /> Pickup location
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{food.pickup_address}</div>
          </div>

          {food.instructions && (
            <div>
              <h3 className="font-semibold text-sm mb-1">Special instructions</h3>
              <p className="text-sm text-muted-foreground">{food.instructions}</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-background border-t">
          <Link to="/booking/confirm" search={{ id: food.id }}>
            <Button size="lg" className="w-full h-12 rounded-xl">Reserve this meal</Button>
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
