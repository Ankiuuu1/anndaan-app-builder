import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/notifications")({
  component: () => (
    <AppLayout title="Notifications">
      <div className="p-6 text-center text-muted-foreground pb-24">
        No notifications yet.
      </div>
    </AppLayout>
  ),
});
