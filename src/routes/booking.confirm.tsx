import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/booking/confirm")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s.id === "string" ? s.id : "",
  }),
  component: ConfirmBooking,
});

function ConfirmBooking() {
  useRequireAuth();
  const { user } = useAuth();
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: food } = useQuery({
    queryKey: ["food", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await supabase.from("food_items").select("title, pickup_address, photo_url").eq("id", id).maybeSingle();
      return data;
    },
  });

  const confirm = async () => {
    if (!user || !id) return;
    setSaving(true);
    const { error } = await supabase.from("bookings").insert({
      food_item_id: id,
      recipient_id: user.id,
      notes: notes || null,
      status: "pending",
    });
    if (!error) {
      await supabase.from("food_items").update({ status: "reserved" }).eq("id", id);
    }
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Booking requested!");
    navigate({ to: "/bookings" });
  };

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        <ScreenHeader title="Confirm booking" />
        <div className="flex-1 p-4 space-y-5 pb-24">
          <Card className="p-4 flex items-center gap-3 shadow-[var(--shadow-card)]">
            <div className="h-14 w-14 rounded-xl bg-secondary grid place-items-center text-2xl overflow-hidden">
              {food?.photo_url ? <img src={food.photo_url} alt="" className="w-full h-full object-cover" /> : "🍱"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{food?.title || "..."}</div>
              <div className="text-xs text-muted-foreground truncate">{food?.pickup_address}</div>
            </div>
          </Card>

          <div className="space-y-2">
            <Label>Pickup notes</Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Bringing my own bag, will call on arrival" className="rounded-xl" />
          </div>

          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
            <span className="text-muted-foreground">I agree to AnnDaan's food safety guidelines and pickup terms.</span>
          </label>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => history.back()}>Cancel</Button>
            <Button disabled={!agreed || saving} className="flex-1 h-11 rounded-xl" onClick={confirm}>
              {saving ? "Booking..." : "Confirm"}
            </Button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
