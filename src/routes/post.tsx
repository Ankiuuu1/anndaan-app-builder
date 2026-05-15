import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/post")({
  component: PostFood,
});

const cats = ["Vegetarian", "Non-Veg", "Vegan", "Jain"];

function PostFood() {
  const navigate = useNavigate();
  const [cat, setCat] = useState("Vegetarian");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/food/posted" });
  };

  return (
    <AppLayout title="Post Food">
      <form onSubmit={submit} className="p-4 space-y-5 pb-28">
        <button
          type="button"
          className="w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-border bg-secondary grid place-items-center"
        >
          <div className="text-center">
            <Camera className="h-7 w-7 mx-auto text-muted-foreground" />
            <div className="text-sm mt-2 text-muted-foreground">Add food photo</div>
          </div>
        </button>

        <div className="space-y-2">
          <Label>Food name</Label>
          <Input className="h-11 rounded-xl" placeholder="e.g. Veg biryani with raita" />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-sm",
                  cat === c ? "border-primary bg-primary/10 text-primary" : "hover:border-primary/40"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Cuisine</Label>
            <select className="w-full h-11 rounded-xl border bg-background px-3 text-sm">
              {["Indian", "Chinese", "Italian", "Continental", "Other"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Serves (people)</Label>
            <Input type="number" min={1} defaultValue={2} className="h-11 rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Prepared</Label>
            <select className="w-full h-11 rounded-xl border bg-background px-3 text-sm">
              {["Just now", "30 min ago", "1 hour ago", "2 hours ago", "More"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Best before</Label>
            <Input type="time" className="h-11 rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Pickup location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="h-11 rounded-xl pl-9" defaultValue="Use my current location" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Special instructions</Label>
          <Textarea rows={3} placeholder="Allergens, packaging, contact preferences..." className="rounded-xl" />
        </div>

        <Button type="submit" size="lg" className="w-full h-12 rounded-xl">
          Post food
        </Button>
      </form>
    </AppLayout>
  );
}
