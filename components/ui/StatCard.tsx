interface StatCardProps {
  label: string;
  value: string | number;
  accent?: string;
  icon?: string;
  trend?: string;
}

export function StatCard({
  label,
  value,
  accent = 'text-emerald-400',
  icon,
  trend,
}: StatCardProps) {
  return (
    <div className="glass-card group relative overflow-hidden transition hover:border-emerald-500/20">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-2xl transition group-hover:bg-emerald-500/10" />
      <div className="relative flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className={`mt-2 text-2xl font-bold tabular-nums ${accent}`}>{value}</p>
          {trend ? <p className="mt-1 text-xs text-slate-500">{trend}</p> : null}
        </div>
        {icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 text-lg">
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
}
