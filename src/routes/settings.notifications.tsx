import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/settings/notifications")({
  component: NotificationSettings,
});

const groups = [
  {
    title: "Push notifications",
    items: [
      { id: "push-bookings", label: "Booking updates", desc: "Confirmations, ready, picked up" },
      { id: "push-nearby", label: "Nearby food alerts", desc: "Fresh donations in your area" },
      { id: "push-volunteer", label: "Volunteer requests", desc: "Pickup opportunities" },
      { id: "push-impact", label: "Impact milestones", desc: "Weekly recap and badges" },
    ],
  },
  {
    title: "SMS",
    items: [
      { id: "sms-otp", label: "OTPs and security", desc: "Always on for account safety" },
      { id: "sms-pickup", label: "Pickup reminders", desc: "30 min before scheduled time" },
    ],
  },
  {
    title: "Email",
    items: [
      { id: "email-receipts", label: "Donation receipts", desc: "For tax records" },
      { id: "email-news", label: "Community newsletter", desc: "Monthly highlights" },
    ],
  },
];

function NotificationSettings() {
  const [state, setState] = useState<Record<string, boolean>>({
    "push-bookings": true,
    "push-nearby": true,
    "push-volunteer": false,
    "push-impact": true,
    "sms-otp": true,
    "sms-pickup": true,
    "email-receipts": true,
    "email-news": false,
  });

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        <ScreenHeader title="Notifications" />
        <div className="flex-1 p-4 space-y-5 pb-8">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">
                {g.title}
              </div>
              <Card className="divide-y shadow-[var(--shadow-card)]">
                {g.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 p-4">
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={it.id} className="text-sm font-medium block">{it.label}</Label>
                      <div className="text-xs text-muted-foreground mt-0.5">{it.desc}</div>
                    </div>
                    <Switch
                      id={it.id}
                      checked={!!state[it.id]}
                      onCheckedChange={(v) => setState((s) => ({ ...s, [it.id]: v }))}
                    />
                  </div>
                ))}
              </Card>
            </div>
          ))}

          <Card className="p-4 shadow-[var(--shadow-card)]">
            <div className="font-semibold text-sm">Quiet hours</div>
            <div className="text-xs text-muted-foreground mt-0.5">Mute non-urgent alerts overnight</div>
            <div className="mt-3 flex items-center gap-2">
              <input type="time" defaultValue="22:00" className="flex-1 h-10 rounded-lg border px-3 text-sm" />
              <span className="text-muted-foreground">to</span>
              <input type="time" defaultValue="07:00" className="flex-1 h-10 rounded-lg border px-3 text-sm" />
            </div>
          </Card>
        </div>
      </div>
    </MobileShell>
  );
}
