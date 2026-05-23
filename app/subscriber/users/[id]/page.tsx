'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { UserFormModal } from '@/components/forms/UserFormModal';
import { StatCard } from '@/components/ui/StatCard';
import { apiGetUser } from '@/lib/api';
import { SUBSCRIBER_NAV } from '@/lib/adminNav';
import type { EndUser, UserDetailResponse } from '@/types';
import { UserRole } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<UserDetailResponse | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const load = () => {
    if (id) apiGetUser(id).then(setData);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowed={[UserRole.SUBSCRIBER]}>
      <DashboardLayout nav={[...SUBSCRIBER_NAV]} title="Subscriber Panel">
        <PageHeader
          title={data.user.fullName}
          description={`${data.user.email} · ${data.user.phone}`}
          actions={
            <Button onClick={() => setEditOpen(true)}>Edit User</Button>
          }
        />

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Review Amount" value={formatCurrency(data.summary.totalReviewAmount)} icon="📝" />
          <StatCard label="Total Paid" value={formatCurrency(data.summary.totalPaid)} accent="text-sky-400" icon="✅" />
          <StatCard
            label="Remaining Balance"
            value={formatCurrency(data.summary.remainingBalance)}
            accent="text-amber-400"
            icon="⏳"
          />
        </div>

        {data.user.subjects?.length ? (
          <div className="glass-card mb-8">
            <h3 className="mb-3 font-semibold text-white">Subject rates</h3>
            <div className="flex flex-wrap gap-2">
              {data.user.subjects.map((s) => (
                <span
                  key={s.subjectName}
                  className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300"
                >
                  {s.subjectName} — {formatCurrency(s.amountPerHour)}/hr
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <h3 className="mb-3 text-lg font-semibold">Reviews</h3>
        <div className="glass-card mb-8 overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-500">
              <tr>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.reviews.map((r) => (
                <tr key={r._id} className="border-t border-slate-800/80">
                  <td className="p-3">{r.subjectName}</td>
                  <td className="p-3 text-center">{r.hours}</td>
                  <td className="p-3">{formatCurrency(r.finalAmount)}</td>
                  <td className="p-3">{formatDate(r.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mb-3 text-lg font-semibold">Transactions</h3>
        <div className="glass-card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-500">
              <tr>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3">Date</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((t) => (
                <tr key={t._id} className="border-t border-slate-800/80">
                  <td className="p-3">{formatCurrency(t.amountPaid)}</td>
                  <td className="p-3">{formatDate(t.paymentDate)}</td>
                  <td className="p-3">{t.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <UserFormModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={load}
          user={data.user as EndUser}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
