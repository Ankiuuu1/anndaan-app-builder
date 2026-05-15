import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/discover")({
  component: () => (
    <AppLayout title="Discover">
      <div className="p-6 text-center text-muted-foreground pb-24">
        Discover nearby food — coming in Phase 3.
      </div>
    </AppLayout>
  ),
});
