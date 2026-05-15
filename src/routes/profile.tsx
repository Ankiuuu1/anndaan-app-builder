import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/profile")({
  component: () => (
    <AppLayout title="Profile">
      <div className="p-6 text-center text-muted-foreground pb-24">
        Profile — coming in Phase 2.
      </div>
    </AppLayout>
  ),
});
