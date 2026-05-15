import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertTriangle, Phone, MapPin, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/safety/emergency")({
  component: Emergency,
});

const contacts = [
  { name: "Police", number: "100", color: "bg-destructive" },
  { name: "Ambulance", number: "108", color: "bg-warning" },
  { name: "AnnDaan Helpline", number: "1800 200 200", color: "bg-primary" },
];

const templates = [
  "I feel unsafe at this pickup location.",
  "There's an issue with the food quality — possibly unsafe.",
  "I need immediate assistance, please contact me.",
];

function Emergency() {
  const [share, setShare] = useState(true);
  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        <ScreenHeader title="Emergency" />
        <div className="flex-1 p-4 space-y-5 pb-8">
          <Card className="p-4 bg-destructive/5 border-destructive/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <div className="font-semibold">If you're in immediate danger</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Tap a contact below. Your live location can be shared with our safety team.
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-2">
            {contacts.map((c) => (
              <button
                key={c.name}
                className={`${c.color} text-white rounded-2xl p-4 flex items-center gap-3 shadow-[var(--shadow-card)] active:scale-[0.99]`}
              >
                <Phone className="h-5 w-5" />
                <div className="flex-1 text-left">
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs opacity-90">{c.number}</div>
                </div>
              </button>
            ))}
          </div>

          <Card className="p-4 flex items-center gap-3 shadow-[var(--shadow-card)]">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-semibold text-sm">Share my live location</div>
              <div className="text-xs text-muted-foreground">With AnnDaan safety team for 1 hour</div>
            </div>
            <Switch checked={share} onCheckedChange={setShare} />
          </Card>

          <div>
            <div className="text-sm font-semibold mb-2">Quick message templates</div>
            <div className="space-y-2">
              {templates.map((t) => (
                <button
                  key={t}
                  className="w-full text-left text-sm p-3 rounded-xl border hover:border-primary/40"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Card className="p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <ShieldAlert className="h-4 w-4" /> Report an incident
            </div>
            <Textarea rows={3} placeholder="Describe what happened..." className="mt-2 rounded-xl" />
            <Button className="w-full mt-2 h-11 rounded-xl">Submit report</Button>
          </Card>

          <div className="text-xs text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground">Safety guidelines</div>
            <p>Meet in well-lit public locations. Inspect food before accepting. Trust your instincts.</p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
