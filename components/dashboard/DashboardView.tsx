'use client';

import { useEffect, useState } from 'react';
import { apiGetDashboard } from '@/lib/api';
import type { DashboardData, ListFilters } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/ui/StatCard';
import { FilterBar } from '@/components/ui/FilterBar';
import { RevenueChart } from '@/components/charts/RevenueChart';

interface DashboardViewProps {
  showAdminStats?: boolean;
}

export function DashboardView({ showAdminStats = false }: DashboardViewProps) {
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

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return null;

  const { stats, charts } = data;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Dashboard</h2>
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {showAdminStats && (
          <>
            <StatCard label="Total Subscribers" value={stats.totalSubscribers} />
            <StatCard label="Total Users" value={stats.totalUsers} />
          </>
        )}
        {!showAdminStats && <StatCard label="My Users" value={stats.totalUsers} />}
        <StatCard label="Reviews" value={stats.totalReviews} />
        <StatCard label="Transactions" value={stats.totalTransactions} />
        <StatCard label="Total Amount" value={formatCurrency(stats.totalAmount)} />
        <StatCard label="Total Paid" value={formatCurrency(stats.totalPaid)} accent="text-sky-400" />
        <StatCard label="Remaining" value={formatCurrency(stats.remainingBalance)} accent="text-amber-400" />
        <StatCard label="Weekly Revenue" value={formatCurrency(stats.weeklyRevenue)} />
        <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} />
        <StatCard label="Yearly Revenue" value={formatCurrency(stats.yearlyRevenue)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RevenueChart data={charts.revenueAnalytics} title="Revenue Analytics" />
        <RevenueChart data={charts.paymentTracking} title="Payment Tracking" />
      </div>
    </div>
  );
}
