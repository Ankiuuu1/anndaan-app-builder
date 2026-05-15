import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/booking/confirm")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s.id === "string" ? s.id : "",
  }),
  component: ConfirmBooking,
});

const slots = ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"];

function ConfirmBooking() {
  const navigate = useNavigate();
  const [slot, setSlot] = useState(slots[1]);
  const [agreed, setAgreed] = useState(false);

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        <ScreenHeader title="Confirm booking" />
        <div className="flex-1 p-4 space-y-5 pb-24">
          <Card className="p-4 flex items-center gap-3 shadow-[var(--shadow-card)]">
            <div className="h-14 w-14 rounded-xl bg-secondary grid place-items-center text-2xl">🍱</div>
            <div className="flex-1">
              <div className="font-semibold">Veg Thali</div>
              <div className="text-xs text-muted-foreground">Annapurna Kitchen · 0.6 km</div>
            </div>
          </Card>

          <div>
            <Label className="text-sm">Pickup time</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`h-10 rounded-xl border text-sm font-medium ${slot === s ? "border-primary bg-primary/10 text-primary" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pickup notes</Label>
            <Textarea rows={3} placeholder="Bringing my own bag, will call on arrival" className="rounded-xl" />
          </div>

          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
            <span className="text-muted-foreground">
              I agree to AnnDaan's food safety guidelines and pickup terms.
            </span>
          </label>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => history.back()}>
              Cancel
            </Button>
            <Button
              disabled={!agreed}
              className="flex-1 h-11 rounded-xl"
              onClick={() => navigate({ to: "/bookings" })}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
