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
  const gradId = `revGrad-${title.replace(/\s/g, '')}`;
  const chartData: ChartPoint[] = (data || []).map((d) => ({
    name: `${d._id.month}/${d._id.year}`,
    revenue: d.total,
    count: d.count,
  }));

  if (!chartData.length) {
    return (
      <div className="glass-card flex h-64 items-center justify-center text-sm text-slate-500">
        No chart data for this period
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 className="mb-4 text-sm font-semibold text-slate-300">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#34d399" fill={`url(#${gradId})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
