interface Props {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export default function ProgressRing({
  value,
  size = 120,
  stroke = 12,
  color = '#0046AD',
  label,
  sublabel,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div className="-mt-[80px] text-center pointer-events-none" style={{ height: 80 - 8, paddingTop: 16 }}>
        <div className="text-2xl font-bold text-cube-blue">{label}</div>
        <div className="text-xs text-gray-500">{sublabel}</div>
      </div>
    </div>
  );
}
