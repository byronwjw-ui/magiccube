interface Day { date: string; count: number; }

export default function Heatmap({ days }: { days: Day[] }) {
  function level(c: number): string {
    if (c === 0) return 'bg-gray-100';
    if (c < 5) return 'bg-cube-yellow/40';
    if (c < 10) return 'bg-cube-yellow/70';
    if (c < 20) return 'bg-cube-yellow';
    return 'bg-cube-blue';
  }
  // 插入前导空格使周一对齐（周一为首列）
  const first = days[0]?.date ? new Date(days[0].date) : new Date();
  const firstWeekday = (first.getDay() + 6) % 7; // 0=Mon
  const pad = Array.from({ length: firstWeekday }, () => null as null | Day);
  const cells: Array<null | Day> = [...pad, ...days];
  return (
    <div className="flex flex-col gap-1" style={{ gridAutoFlow: 'column' }}>
      <div className="grid grid-flow-col grid-rows-7 gap-1">
        {cells.map((d, i) => (
          <div
            key={i}
            title={d ? `${d.date}: ${d.count} 题` : ''}
            className={`w-3.5 h-3.5 rounded-sm ${d ? level(d.count) : 'bg-transparent'}`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <span>少</span>
        <span className="w-3 h-3 rounded-sm bg-gray-100" />
        <span className="w-3 h-3 rounded-sm bg-cube-yellow/40" />
        <span className="w-3 h-3 rounded-sm bg-cube-yellow/70" />
        <span className="w-3 h-3 rounded-sm bg-cube-yellow" />
        <span className="w-3 h-3 rounded-sm bg-cube-blue" />
        <span>多</span>
      </div>
    </div>
  );
}
