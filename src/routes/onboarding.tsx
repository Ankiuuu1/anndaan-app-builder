import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/button";
import { Utensils, MapPin, Bike, Heart } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const slides = [
  {
    icon: Utensils,
    title: "Share Surplus Food",
    body: "Restaurants, banquets and home cooks can post leftover meals in seconds.",
  },
  {
    icon: MapPin,
    title: "Discover Nearby",
    body: "Find fresh, free food around you with live freshness scores and maps.",
  },
  {
    icon: Bike,
    title: "Volunteer & Deliver",
    body: "Pick up donations, optimize routes, and make every meal count.",
  },
  {
    icon: Heart,
    title: "Build Impact",
    body: "Track meals saved, CO₂ avoided, and lives touched — together.",
  },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const last = step === slides.length - 1;
  const Slide = slides[step];
  const Icon = Slide.icon;

  const next = () => {
    if (last) navigate({ to: "/" });
    else setStep((s) => s + 1);
  };

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen p-6">
        <div className="flex justify-end">
          <button
            onClick={() => navigate({ to: "/" })}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 animate-fade-in" key={step}>
          <div className="h-32 w-32 rounded-3xl bg-primary/10 text-primary grid place-items-center">
            <Icon className="h-16 w-16" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{Slide.title}</h2>
          <p className="text-muted-foreground max-w-xs">{Slide.body}</p>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-8 bg-primary" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
        <Button size="lg" className="w-full h-12 rounded-xl" onClick={next}>
          {last ? "Get Started" : "Next"}
        </Button>
      </div>
    </MobileShell>
  );
}
