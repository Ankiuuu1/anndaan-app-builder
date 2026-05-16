import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MobileShell } from "@/components/layout/MobileShell";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/otp")({
  validateSearch: (s: Record<string, unknown>) => ({
    phone: typeof s.phone === "string" ? s.phone : "",
  }),
  component: OtpVerify,
});

function OtpVerify() {
  const { phone } = Route.useSearch();
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const setAt = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = ch;
    setDigits(next);
    if (ch && i < 5) inputs.current[i + 1]?.focus();
  };

  const verify = async () => {
    const code = digits.join("");
    if (code.length !== 6) return;
    const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: "sms" });
    if (error) {
      toast.error(error.message || "Invalid or expired code");
      return;
    }
    navigate({ to: "/profile/setup" });
  };

  const resend = async () => {
    if (!phone) return;
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      toast.error(error.message || "Could not resend code");
      return;
    }
    setSeconds(30);
    toast.success("Code sent");
  };

  return (
    <MobileShell>
      <div className="flex flex-col min-h-screen">
        <ScreenHeader title="Verify your number" />
        <div className="flex-1 p-6">
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-semibold text-foreground">{phone || "your phone"}</span>
          </p>

          <div className="flex justify-between gap-2 mt-8">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                value={d}
                onChange={(e) => setAt(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
                }}
                inputMode="numeric"
                maxLength={1}
                className="h-14 w-12 rounded-xl border-2 border-border focus:border-primary text-center text-xl font-bold bg-card outline-none"
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 text-sm">
            <button
              disabled={seconds > 0}
              onClick={() => setSeconds(30)}
              className="text-primary font-semibold disabled:text-muted-foreground"
            >
              Resend OTP {seconds > 0 && `(${seconds}s)`}
            </button>
            <button onClick={() => history.back()} className="text-muted-foreground">
              Change number
            </button>
          </div>

          <Button size="lg" className="w-full h-12 rounded-xl mt-8" onClick={verify}>
            Verify
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
