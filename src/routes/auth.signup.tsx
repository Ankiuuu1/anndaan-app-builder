import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MobileShell } from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleCard } from "@/components/common/RoleCard";
import { Sprout, Heart, Bike, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/signup")({
  component: Signup,
});

const roles = [
  { id: "donor" as const, icon: Sprout, title: "Donor", description: "Share surplus food from home or business" },
  { id: "recipient" as const, icon: Heart, title: "Recipient", description: "Find free meals nearby for yourself or community" },
  { id: "volunteer" as const, icon: Bike, title: "Volunteer", description: "Help pickup and deliver food to those in need" },
  { id: "ngo" as const, icon: Building2, title: "NGO / Org", description: "Coordinate larger donations and distribution" },
];

function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [role, setRole] = useState<typeof roles[number]["id"]>("donor");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !agreed) {
      toast.error("Please fill all required fields and accept terms");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: name, phone, role },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your email to confirm your account");
    navigate({ to: "/auth/login" });
  };

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen p-6">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose your role to get started.</p>

        <form onSubmit={submit} className="mt-6 space-y-5 pb-8">
          <div className="space-y-2">
            {roles.map((r) => (
              <RoleCard
                key={r.id}
                icon={r.icon}
                title={r.title}
                description={r.description}
                selected={role === r.id}
                onClick={() => setRole(r.id)}
              />
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" placeholder="Aarav Sharma" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl" placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl" />
          </div>

          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
            <span className="text-muted-foreground">
              I agree to the <span className="text-primary font-medium">Terms</span> and{" "}
              <span className="text-primary font-medium">Privacy Policy</span>.
            </span>
          </label>

          <Button type="submit" size="lg" className="w-full h-12 rounded-xl" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>

          <Button type="button" variant="outline" className="w-full h-12 rounded-xl" onClick={google} disabled={loading}>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary font-semibold">Login</Link>
          </p>
        </form>
      </div>
    </MobileShell>
  );
}
