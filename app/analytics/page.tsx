'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiGetAnalytics } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { getRoleHomePath } from '@/lib/auth';
import { SUBSCRIBER_NAV } from '@/lib/adminNav';
import { REVIEW_TYPE_LABELS, ReviewType } from '@/types';
import { UserRole } from '@/types';

const TYPE_COLORS: Record<ReviewType, string> = {
  daily: '#34d399',
  weekly: '#38bdf8',
  monthly: '#a78bfa',
};

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const pieData = (['daily', 'weekly', 'monthly'] as ReviewType[]).map((type) => ({
    name: REVIEW_TYPE_LABELS[type],
    type,
    value: type === 'weekly' ? 12 : type === 'monthly' ? 8 : 5,
  }));

  const barData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6100 },
  ];

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    apiGetAnalytics({ period: 'month' })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090f] text-emerald-400">
        Loading analytics…
      </div>
    );
  }

  const nav =
    user?.type === UserRole.ADMIN
      ? [{ href: getRoleHomePath(user.type), label: 'Dashboard' }]
      : [...SUBSCRIBER_NAV];

  return (
    <ProtectedRoute allowed={[UserRole.ADMIN, UserRole.SUBSCRIBER]}>
      <DashboardLayout nav={nav} title="Analytics">
        <PageHeader
          title="Analytics"
          description="Review cadence breakdown (daily, weekly, monthly) and revenue trends."
        />
        {error ? <p className="mb-4 text-red-400">{error}</p> : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card">
            <h3 className="mb-4 text-sm font-semibold text-slate-300">Reviews by type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry) => (
                      <Cell key={entry.type} fill={TYPE_COLORS[entry.type]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="mb-4 text-sm font-semibold text-slate-300">Revenue trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#34d399" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
