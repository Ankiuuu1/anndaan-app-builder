import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MobileShell } from "@/components/layout/MobileShell";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfile,
});

function EditProfile() {
  useRequireAuth();
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orgName, setOrgName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
      setAddress(profile.address ?? "");
      setOrgName(profile.org_name ?? "");
    }
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: fullName,
          phone,
          address,
          org_name: orgName || null,
        },
        { onConflict: "id" },
      );
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    toast.success("Profile updated");
    router.history.back();
  };

  const initial = (fullName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        <ScreenHeader title="Edit profile" />
        <div className="flex-1 p-6 space-y-5">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initial}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center">
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={user?.email ?? ""} disabled className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Organisation (optional)</Label>
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="h-11 rounded-xl" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => router.history.back()}>
              Cancel
            </Button>
            <Button className="flex-1 h-11 rounded-xl" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
