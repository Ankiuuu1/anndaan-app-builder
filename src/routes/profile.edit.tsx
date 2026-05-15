import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfile,
});

function EditProfile() {
  const router = useRouter();
  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        <ScreenHeader title="Edit profile" />
        <div className="flex-1 p-6 space-y-5">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">A</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Full name</Label>
            <Input defaultValue="Aarav Sharma" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input defaultValue="+91 98765 43210" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" defaultValue="aarav@example.com" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea rows={2} defaultValue="221B Baker Street, Mumbai" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea rows={3} placeholder="Tell the community about yourself" className="rounded-xl" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => router.history.back()}>
              Cancel
            </Button>
            <Button className="flex-1 h-11 rounded-xl" onClick={() => router.history.back()}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
