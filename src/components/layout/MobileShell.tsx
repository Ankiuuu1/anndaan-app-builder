import { ReactNode } from "react";

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centered mobile-first viewport. On larger screens, the app sits inside a
 * phone-sized frame with subtle elevation.
 */
export function MobileShell({ children, className = "" }: MobileShellProps) {
  return (
    <div className="min-h-screen w-full bg-secondary/40 flex justify-center">
      <div
        className={`relative w-full max-w-[480px] min-h-screen bg-background shadow-[var(--shadow-elevated)] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
