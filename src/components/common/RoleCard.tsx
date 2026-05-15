import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

export function RoleCard({ icon: Icon, title, description, selected, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-[var(--shadow-card)]"
          : "border-border bg-card hover:border-primary/40"
      )}
    >
      <div
        className={cn(
          "h-11 w-11 rounded-xl grid place-items-center shrink-0",
          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
      </div>
    </button>
  );
}
