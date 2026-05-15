import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Camera, MapPin } from "lucide-react";

export const Route = createFileRoute("/profile/setup")({
  component: ProfileSetup,
});

function ProfileSetup() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        <ScreenHeader title="Complete your profile" />
        <div className="flex-1 p-6 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <button className="relative h-24 w-24 rounded-full bg-secondary grid place-items-center border-2 border-dashed border-border">
              <Camera className="h-7 w-7 text-muted-foreground" />
              <span className="absolute -bottom-1 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-lg font-bold">+</span>
            </button>
            <p className="text-xs text-muted-foreground">Add a profile photo</p>
          </div>

          <div className="space-y-2">
            <Label>Display name</Label>
            <Input className="h-11 rounded-xl" placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="h-11 rounded-xl pl-9"
                placeholder="Search your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button className="text-xs text-primary font-medium">Use my current location</button>
          </div>

          <div className="space-y-2">
            <Label>Dietary preferences</Label>
            <div className="flex flex-wrap gap-2">
              {["Vegetarian", "Vegan", "Halal", "Jain", "No preference"].map((d) => (
                <button
                  key={d}
                  className="px-3 py-1.5 rounded-full border text-sm hover:border-primary hover:text-primary"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" className="w-full h-12 rounded-xl" onClick={() => navigate({ to: "/" })}>
            Complete setup
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
