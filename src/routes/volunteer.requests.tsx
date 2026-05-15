import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/volunteer/requests")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s.id === "number" ? s.id : 1,
  }),
  component: VolunteerRequest,
});

function VolunteerRequest() {
  const { id } = Route.useSearch();
  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen pb-24">
        <ScreenHeader title={`Pickup request #${id}`} />
        <div className="p-4 space-y-4">
          <Card className="aspect-[16/10] grid place-items-center bg-gradient-to-br from-secondary to-primary/10 text-muted-foreground text-sm">
            <div className="text-center">
              <Navigation className="h-6 w-6 mx-auto mb-1 text-primary" />
              Route preview · 1.2 km · ~6 min
            </div>
          </Card>

          <Card className="p-4 space-y-3 shadow-[var(--shadow-card)]">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center font-bold">A</div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Pickup from</div>
                <div className="font-semibold">Annapurna Kitchen</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> 221B Baker Street
                </div>
              </div>
              <button className="h-9 w-9 rounded-full bg-secondary grid place-items-center" aria-label="Call donor">
                <Phone className="h-4 w-4" />
              </button>
            </div>

            <div className="border-l-2 border-dashed border-border ml-4 h-4" />

            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/15 text-accent grid place-items-center font-bold">N</div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Deliver to</div>
                <div className="font-semibold">Sunshine NGO</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Plot 14, Andheri West
                </div>
              </div>
              <button className="h-9 w-9 rounded-full bg-secondary grid place-items-center" aria-label="Call recipient">
                <Phone className="h-4 w-4" />
              </button>
            </div>
          </Card>

          <Card className="p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4" /> Pickup window
            </div>
            <div className="text-sm text-muted-foreground mt-1">Today · 6:00 PM — 7:00 PM</div>
          </Card>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-background border-t flex gap-2">
          <Button variant="outline" className="flex-1 h-12 rounded-xl">Update status</Button>
          <Button className="flex-1 h-12 rounded-xl">Start pickup</Button>
        </div>
      </div>
    </MobileShell>
  );
}
