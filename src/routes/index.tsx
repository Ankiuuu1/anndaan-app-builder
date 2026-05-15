import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sprout, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <AppLayout title="AnnDaan">
      <div className="p-4 space-y-5 pb-24">
        <section className="rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs uppercase tracking-wider opacity-80">Welcome back</p>
          <h2 className="text-xl font-bold mt-1">Save food. Feed people.</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 text-xs opacity-90">
                <Sprout className="h-3.5 w-3.5" /> Meals saved
              </div>
              <div className="text-2xl font-bold mt-1">128</div>
            </div>
            <div className="rounded-xl bg-white/15 p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 text-xs opacity-90">
                <Users className="h-3.5 w-3.5" /> People helped
              </div>
              <div className="text-2xl font-bold mt-1">54</div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Nearby Food</h3>
            <Link to={"/discover" as never} className="text-sm text-primary flex items-center gap-1">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-3 flex gap-3 items-center shadow-[var(--shadow-card)]">
                <div className="h-16 w-16 rounded-xl bg-secondary grid place-items-center text-2xl">
                  🍱
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">Veg Thali #{i}</div>
                  <div className="text-xs text-muted-foreground">0.{i + 2} km away · Fresh 92%</div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-success/15 text-success">
                  Available
                </span>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
