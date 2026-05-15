import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

interface ScreenHeaderProps {
  title: string;
  right?: ReactNode;
  onBack?: () => void;
}

export function ScreenHeader({ title, right, onBack }: ScreenHeaderProps) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-background/95 backdrop-blur px-2 h-14 border-b">
      <button
        onClick={onBack ?? (() => router.history.back())}
        className="h-10 w-10 grid place-items-center rounded-full hover:bg-secondary"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h1 className="font-semibold text-base truncate">{title}</h1>
      <div className="w-10 flex items-center justify-end pr-2">{right}</div>
    </header>
  );
}
