interface FreshnessRingProps {
  value: number; // 0-100
  size?: number;
  label?: string;
}

export function FreshnessRing({ value, size = 56, label }: FreshnessRingProps) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color =
    value >= 75 ? "var(--color-success)" : value >= 40 ? "var(--color-accent)" : "var(--color-destructive)";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-secondary)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xs font-bold leading-none">{value}%</div>
        {label && <div className="text-[9px] text-muted-foreground mt-0.5">{label}</div>}
      </div>
    </div>
  );
}
