'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartPoint {
  name: string;
  revenue: number;
  count: number;
}

interface RevenueChartProps {
  data: Array<{ _id: { year: number; month: number }; total: number; count: number }>;
  title?: string;
}

export function RevenueChart({ data, title = 'Monthly Revenue' }: RevenueChartProps) {
  const chartData: ChartPoint[] = data.map((d) => ({
    name: `${d._id.month}/${d._id.year}`,
    revenue: d.total,
    count: d.count,
  }));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="mb-4 text-sm font-medium text-slate-400">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
            <Area type="monotone" dataKey="revenue" stroke="#34d399" fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
