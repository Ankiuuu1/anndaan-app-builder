import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  ChevronRight,
  Settings,
  Bell,
  Lock,
  HelpCircle,
  FileText,
  LogOut,
  Edit3,
  Trophy,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

const menu = [
  { icon: Settings, label: "Personal information", to: "/profile/edit" },
  { icon: Bell, label: "Notification preferences", to: "/settings/notifications" },
  { icon: Lock, label: "Privacy settings", to: "/help" },
  { icon: HelpCircle, label: "Help & support", to: "/help" },
  { icon: FileText, label: "Terms & conditions", to: "/help" },
] as const;

function Profile() {
  return (
    <AppLayout title="Profile">
      <div className="p-4 space-y-5 pb-24">
        <Card className="p-5 flex items-center gap-4 shadow-[var(--shadow-card)]">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">A</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-lg truncate">Aarav Sharma</h2>
              <ShieldCheck className="h-4 w-4 text-success" />
            </div>
            <Badge variant="secondary" className="mt-1">Donor</Badge>
          </div>
          <Link to="/profile/edit" aria-label="Edit profile" className="h-9 w-9 rounded-full bg-secondary grid place-items-center">
            <Edit3 className="h-4 w-4" />
          </Link>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {[
            { v: "128", l: "Meals" },
            { v: "54", l: "People" },
            { v: "4.9★", l: "Rating" },
          ].map((s) => (
            <Card key={s.l} className="p-3 text-center shadow-[var(--shadow-card)]">
              <div className="text-xl font-bold text-primary">{s.v}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{s.l}</div>
            </Card>
          ))}
        </div>

        <Card className="p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-sm">Achievements</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {["🌱", "❤️", "🥇", "🍱", "🏆"].map((b, i) => (
              <div key={i} className="h-14 w-14 shrink-0 rounded-2xl bg-secondary grid place-items-center text-2xl">
                {b}
              </div>
            ))}
          </div>
        </Card>

        <Card className="divide-y shadow-[var(--shadow-card)]">
          {menu.map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="flex items-center gap-3 p-4 hover:bg-secondary/50">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </Card>

        <Button variant="outline" className="w-full h-11 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/5">
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </Button>
      </div>
    </AppLayout>
  );
}
