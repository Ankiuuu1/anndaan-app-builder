import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/post")({
  component: () => (
    <AppLayout title="Post Food">
      <div className="p-6 text-center text-muted-foreground pb-24">
        Post a donation — coming in Phase 3.
      </div>
    </AppLayout>
  ),
});
