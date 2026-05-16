import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { FreshnessRing } from "@/components/common/FreshnessRing";
import { Trash2, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { freshnessFromDates } from "@/lib/api";

export const Route = createFileRoute("/food/posted")({
  component: PostedFood,
});

function PostedFood() {
  useRequireAuth();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"active" | "history">("active");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["my-food", user?.id, tab],
    enabled: !!user,
    queryFn: async () => {
      const q = supabase.from("food_items").select("*").eq("donor_id", user!.id).order("created_at", { ascending: false });
      const { data, error } = tab === "active"
        ? await q.eq("status", "available")
        : await q.in("status", ["picked_up", "expired", "cancelled"]);
      if (error) throw error;
      return data;
    },
  });

  const remove = async (id: string) => {
    const { error } = await supabase
      .from("food_items")
      .update({ status: "cancelled" })
      .eq("id", id)
      .eq("donor_id", user!.id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    qc.invalidateQueries({ queryKey: ["my-food"] });
  };

  return (
    <AppLayout title="My Donations">
      <div className="p-4 pb-28">
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
          {!isLoading && items.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-12">No {tab} donations yet.</p>
          )}
          {items.map((it) => (
            <Card key={it.id} className="p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-secondary grid place-items-center text-2xl overflow-hidden">
                  {it.photo_url ? <img src={it.photo_url} alt="" className="w-full h-full object-cover" /> : "🍛"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{it.title}</div>
                  <div className="text-xs text-muted-foreground">Serves {it.quantity_servings}</div>
                </div>
                <FreshnessRing value={freshnessFromDates(it.prepared_at, it.expires_at)} label="fresh" />
              </div>
              {tab === "active" && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => remove(it.id)} className="flex-1 h-9 rounded-lg border border-destructive/30 text-destructive text-sm font-medium flex items-center justify-center gap-1 hover:bg-destructive/5">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Link to="/post" className="fixed bottom-24 right-1/2 translate-x-[218px] z-20 h-14 w-14 rounded-full bg-accent text-accent-foreground grid place-items-center shadow-[var(--shadow-fab)]" aria-label="Post new food">
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </AppLayout>
  );
}
