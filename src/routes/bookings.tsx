import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/bookings")({
  component: Bookings,
});

const statusStyles: Record<string, string> = {
  pending: "bg-accent/15 text-accent",
  confirmed: "bg-accent/15 text-accent",
  ready: "bg-success/15 text-success",
  picked_up: "bg-secondary text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

function Bookings() {
  useRequireAuth();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"active" | "history">("active");

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["bookings", user?.id, tab],
    enabled: !!user,
    queryFn: async () => {
      const q = supabase.from("bookings")
        .select("id, status, notes, created_at, food_items(title, photo_url, pickup_address)")
        .eq("recipient_id", user!.id)
        .order("created_at", { ascending: false });
      const { data, error } = tab === "active"
        ? await q.in("status", ["pending", "confirmed", "ready"])
        : await q.in("status", ["picked_up", "cancelled"]);
      if (error) throw error;
      return data;
    },
  });

  const markPickedUp = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "picked_up" })
      .eq("id", bookingId)
      .eq("recipient_id", user!.id);
    if (error) return toast.error(error.message);
    toast.success("Marked as picked up");
    qc.invalidateQueries({ queryKey: ["bookings"] });
  };

  return (
    <AppLayout title="My Bookings">
      <div className="p-4 pb-24">
        <div className="flex p-1 rounded-xl bg-secondary text-sm font-medium">
          {(["active", "history"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 h-9 rounded-lg capitalize ${tab === t ? "bg-background shadow-[var(--shadow-card)]" : "text-muted-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {isLoading && <p className="text-center text-sm text-muted-foreground py-8">Loading...</p>}
          {!isLoading && list.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-12">No {tab} bookings.</p>
          )}
          {list.map((b) => {
            const food = b.food_items as { title: string; photo_url: string | null; pickup_address: string } | null;
            return (
              <Card key={b.id} className="p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-secondary grid place-items-center text-2xl overflow-hidden">
                    {food?.photo_url ? <img src={food.photo_url} alt="" className="w-full h-full object-cover" /> : "🍱"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{food?.title ?? "Food"}</div>
                    <div className="text-xs text-muted-foreground truncate">{food?.pickup_address}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {new Date(b.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Badge className={statusStyles[b.status] ?? ""} variant="secondary">{b.status}</Badge>
                </div>
                {tab === "active" && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => markPickedUp(b.id)} className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                      Mark picked up
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
