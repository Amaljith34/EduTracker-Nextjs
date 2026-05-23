'use client';

import { useEffect, useState } from 'react';
import { apiGetDashboard } from '@/lib/api';
import type { DashboardData, ListFilters } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/ui/StatCard';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { CountChart } from '@/components/charts/CountChart';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAuth } from '@/lib/AuthContext';

interface DashboardViewProps {
  showAdminStats?: boolean;
}

export function DashboardView({ showAdminStats = false }: DashboardViewProps) {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [filters, setFilters] = useState<ListFilters>({ period: 'month' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiGetDashboard(filters)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }
  if (error) return <p className="rounded-xl bg-red-500/10 px-4 py-3 text-red-400">{error}</p>;
  if (!data) return null;

  const { stats, charts } = data;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'there'}`}
        description="Track reviews, payments, and revenue at a glance."
      />

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showAdminStats && (
          <>
            <StatCard label="Subscribers" value={stats.totalSubscribers} icon="👥" />
            <StatCard label="Users" value={stats.totalUsers} icon="🎓" accent="text-sky-400" />
          </>
        )}
        {!showAdminStats && (
          <StatCard label="My Users" value={stats.totalUsers} icon="🎓" accent="text-sky-400" />
        )}
        <StatCard label="Reviews" value={stats.totalReviews} icon="📝" />
        <StatCard label="Transactions" value={stats.totalTransactions} icon="💳" accent="text-violet-400" />
        <StatCard label="Total Due" value={formatCurrency(stats.totalAmount)} icon="📋" />
        <StatCard label="Collected" value={formatCurrency(stats.totalPaid)} accent="text-sky-400" icon="✅" />
        <StatCard
          label="Outstanding"
          value={formatCurrency(stats.remainingBalance)}
          accent="text-amber-400"
          icon="⏳"
        />
        <StatCard
          label="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          accent="text-emerald-400"
          icon="📈"
          trend={`Weekly: ${formatCurrency(stats.weeklyRevenue)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={charts.revenueAnalytics || []} title="Revenue Analytics" />
        <RevenueChart data={charts.paymentTracking || []} title="Payment Tracking" />
        <CountChart
          data={charts.reviewCountByMonth || []}
          title="Reviews by Month"
          dataKey="count"
          color="#34d399"
        />
        <CountChart
          data={charts.monthlyEarnings || []}
          title="Monthly Earnings"
          dataKey="total"
          color="#a78bfa"
        />
      </div>
    </div>
  );
}
