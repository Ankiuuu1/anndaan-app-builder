import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleCard } from "@/components/common/RoleCard";
import { Sprout, Heart, Bike, Building2 } from "lucide-react";

export const Route = createFileRoute("/auth/signup")({
  component: Signup,
});

const roles = [
  { id: "donor", icon: Sprout, title: "Donor", description: "Share surplus food from home or business" },
  { id: "recipient", icon: Heart, title: "Recipient", description: "Find free meals nearby for yourself or community" },
  { id: "volunteer", icon: Bike, title: "Volunteer", description: "Help pickup and deliver food to those in need" },
  { id: "ngo", icon: Building2, title: "NGO / Org", description: "Coordinate larger donations and distribution" },
];

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("donor");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !agreed) return;
    navigate({ to: "/auth/otp", search: { phone } });
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
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" placeholder="Aarav Sharma" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl" placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" placeholder="you@example.com" />
          </div>

          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
            <span className="text-muted-foreground">
              I agree to the <span className="text-primary font-medium">Terms</span> and{" "}
              <span className="text-primary font-medium">Privacy Policy</span>.
            </span>
          </label>

          <Button type="submit" size="lg" className="w-full h-12 rounded-xl">
            Create account
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
