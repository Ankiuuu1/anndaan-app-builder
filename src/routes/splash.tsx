import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sprout } from "lucide-react";

export const Route = createFileRoute("/splash")({
  component: SplashScreen,
});

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ to: "/onboarding" });
    }, 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full grid place-items-center bg-gradient-to-br from-primary via-primary to-primary-glow text-primary-foreground">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="h-24 w-24 rounded-3xl bg-white/15 backdrop-blur grid place-items-center shadow-[var(--shadow-elevated)]">
          <Sprout className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">AnnDaan</h1>
        <p className="text-sm opacity-90">Save Food, Feed People</p>
        <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-1/3 animate-pulse bg-white/80" />
        </div>
        <p className="text-[11px] opacity-70 mt-4">v1.0.0</p>
      </div>
    </div>
  );
}
