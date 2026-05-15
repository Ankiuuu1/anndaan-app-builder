import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, MessageCircle, BookOpen } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/help")({
  component: Help,
});

const faqs = [
  { q: "How do I post food safely?", a: "Always include accurate prep time, allergens, and best-before. Pack in clean containers." },
  { q: "How is freshness scored?", a: "We compute freshness from prep time, food category, and storage notes." },
  { q: "What happens if a pickup is late?", a: "We notify the donor, and the recipient may release the booking after 30 minutes." },
  { q: "How do I become a verified donor?", a: "Submit your business or address proof in Profile → Verification." },
];

function Help() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        <ScreenHeader title="Help & support" />
        <div className="flex-1 p-4 space-y-5 pb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="h-11 rounded-xl pl-9" placeholder="Search help articles" />
          </div>

          <Card className="divide-y shadow-[var(--shadow-card)]">
            {faqs.map((f, i) => (
              <button
                key={f.q}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left p-4 flex items-start gap-3"
              >
                <BookOpen className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{f.q}</div>
                  {open === i && <p className="text-xs text-muted-foreground mt-1">{f.a}</p>}
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
            ))}
          </Card>

          <Card className="p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <MessageCircle className="h-4 w-4" /> Contact support
            </div>
            <Input placeholder="Subject" className="mt-3 h-11 rounded-xl" />
            <Textarea rows={4} placeholder="How can we help?" className="mt-2 rounded-xl" />
            <Button className="w-full mt-3 h-11 rounded-xl">Send message</Button>
          </Card>

          <div className="text-xs text-muted-foreground text-center">
            AnnDaan v1.0.0 · Community guidelines · Terms · Privacy
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
