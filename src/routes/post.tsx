import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { uploadFoodPhoto, getCurrentLocation } from "@/lib/api";

export const Route = createFileRoute("/post")({
  component: PostFood,
});

const cats = [
  { v: "veg" as const, l: "Vegetarian" },
  { v: "non_veg" as const, l: "Non-Veg" },
  { v: "vegan" as const, l: "Vegan" },
];

function PostFood() {
  useRequireAuth();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [cat, setCat] = useState<"veg" | "non_veg" | "vegan">("veg");
  const [title, setTitle] = useState("");
  const [cuisine, setCuisine] = useState("Indian");
  const [serves, setServes] = useState(2);
  const [hoursValid, setHoursValid] = useState(4);
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title || !address) {
      toast.error("Add a title and pickup location");
      return;
    }
    setSaving(true);
    try {
      let photo_url: string | null = null;
      if (photoFile) photo_url = await uploadFoodPhoto(user.id, photoFile);
      const loc = await getCurrentLocation();
      const now = new Date();
      const expires = new Date(now.getTime() + hoursValid * 3600_000);

      const { error } = await supabase.from("food_items").insert({
        donor_id: user.id,
        title,
        category: cat,
        cuisine,
        quantity_servings: serves,
        prepared_at: now.toISOString(),
        expires_at: expires.toISOString(),
        pickup_address: address || profile?.address || "",
        lat: loc?.lat ?? profile?.lat ?? null,
        lng: loc?.lng ?? profile?.lng ?? null,
        instructions: instructions || null,
        photo_url,
      });
      if (error) throw error;
      toast.success("Food posted!");
      navigate({ to: "/food/posted" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not post food");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout title="Post Food">
      <form onSubmit={submit} className="p-4 space-y-5 pb-28">
        <label className="block w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-border bg-secondary grid place-items-center cursor-pointer overflow-hidden">
          {photoPreview ? (
            <img src={photoPreview} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <Camera className="h-7 w-7 mx-auto text-muted-foreground" />
              <div className="text-sm mt-2 text-muted-foreground">Add food photo</div>
            </div>
          )}
          <input type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
        </label>

        <div className="space-y-2">
          <Label>Food name</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 rounded-xl" placeholder="e.g. Veg biryani with raita" />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c.v} type="button" onClick={() => setCat(c.v)}
                className={cn("px-3 py-1.5 rounded-full border text-sm",
                  cat === c.v ? "border-primary bg-primary/10 text-primary" : "hover:border-primary/40")}>
                {c.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Cuisine</Label>
            <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="w-full h-11 rounded-xl border bg-background px-3 text-sm">
              {["Indian", "Chinese", "Italian", "Continental", "Other"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Serves (people)</Label>
            <Input type="number" min={1} value={serves} onChange={(e) => setServes(Number(e.target.value))} className="h-11 rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Best within (hours)</Label>
          <Input type="number" min={1} max={24} value={hoursValid} onChange={(e) => setHoursValid(Number(e.target.value))} className="h-11 rounded-xl" />
        </div>

        <div className="space-y-2">
          <Label>Pickup location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-11 rounded-xl pl-9" placeholder="Address or landmark" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Special instructions</Label>
          <Textarea rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Allergens, packaging, contact preferences..." className="rounded-xl" />
        </div>

        <Button type="submit" size="lg" className="w-full h-12 rounded-xl" disabled={saving}>
          {saving ? "Posting..." : "Post food"}
        </Button>
      </form>
    </AppLayout>
  );
}
