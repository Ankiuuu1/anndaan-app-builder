import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, Star, MapPin, Clock, Flag } from "lucide-react";
import { FreshnessRing } from "@/components/common/FreshnessRing";

export const Route = createFileRoute("/food/details/$id")({
  component: FoodDetails,
});

function FoodDetails() {
  const { id } = Route.useParams();
  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen pb-24">
        <ScreenHeader title="Food details" right={<button aria-label="Report"><Flag className="h-4 w-4 text-muted-foreground" /></button>} />

        <div className="aspect-[4/3] bg-gradient-to-br from-accent/30 to-primary/20 grid place-items-center text-7xl">
          🍱
        </div>
        <div className="flex justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 rounded-full ${i === 0 ? "w-6 bg-primary" : "w-1.5 bg-muted"}`} />
          ))}
        </div>

        <div className="p-4 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Veg Thali #{id}</h2>
                <p className="text-sm text-muted-foreground">Fresh North-Indian thali, served warm</p>
              </div>
              <FreshnessRing value={92} label="fresh" size={64} />
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Best within 2h</span>
              <span>· Serves 4</span>
            </div>
          </div>

          <div className="rounded-2xl border p-3 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">A</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 font-semibold">
                Annapurna Kitchen <ShieldCheck className="h-4 w-4 text-success" />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-accent text-accent" /> 4.9 · 124 donations
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" /> Pickup location
            </div>
            <div className="mt-2 aspect-[16/9] rounded-xl bg-gradient-to-br from-secondary to-primary/10 grid place-items-center text-xs text-muted-foreground">
              Map preview
            </div>
            <div className="mt-2 text-xs text-muted-foreground">221B Baker Street · 0.6 km away</div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-1">Special instructions</h3>
            <p className="text-sm text-muted-foreground">
              Bring your own container. Pickup window 6–8 PM. Contains dairy.
            </p>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-background border-t">
          <Link to="/booking/confirm" search={{ id }}>
            <Button size="lg" className="w-full h-12 rounded-xl">Reserve this meal</Button>
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
