'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CountChartProps {
  data: Array<{ _id: { year: number; month: number }; total: number; count: number }>;
  title?: string;
  dataKey?: 'count' | 'total';
  color?: string;
}

export function CountChart({
  data,
  title = 'Activity',
  dataKey = 'count',
  color = '#38bdf8',
}: CountChartProps) {
  const chartData = (data || []).map((d) => ({
    name: `${d._id.month}/${d._id.year}`,
    value: dataKey === 'count' ? d.count : d.total,
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
          <BarChart data={chartData}>
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
            <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
