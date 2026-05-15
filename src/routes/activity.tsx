import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/activity")({
  component: () => (
    <AppLayout title="Activity">
      <div className="p-6 text-center text-muted-foreground pb-24">
        Bookings & activity — coming soon.
      </div>
    </AppLayout>
  ),
});
