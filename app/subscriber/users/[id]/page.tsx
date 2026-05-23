'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiGetUser } from '@/lib/api';
import type { UserDetailResponse } from '@/types';
import { UserRole } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const nav = [
  { href: '/subscriber/dashboard', label: 'Dashboard' },
  { href: '/subscriber/users', label: 'Users' },
  { href: '/subscriber/reviews', label: 'Reviews' },
  { href: '/subscriber/transactions', label: 'Transactions' },
];

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<UserDetailResponse | null>(null);

  useEffect(() => {
    if (id) apiGetUser(id).then(setData);
  }, [id]);

  if (!data) return <p className="p-6 text-slate-500">Loading...</p>;

  return (
    <ProtectedRoute allowed={[UserRole.SUBSCRIBER]}>
      <DashboardLayout nav={nav} title="User Details">
        <h2 className="text-2xl font-bold">{data.user.fullName}</h2>
        <p className="text-slate-500">{data.user.email} · {data.user.phone}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">Total Review Amount</p>
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(data.summary.totalReviewAmount)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">Total Paid</p>
            <p className="text-xl font-bold text-sky-400">{formatCurrency(data.summary.totalPaid)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-500">Remaining Balance</p>
            <p className="text-xl font-bold text-amber-400">{formatCurrency(data.summary.remainingBalance)}</p>
          </div>
        </div>

        <h3 className="mt-8 mb-3 font-semibold">Reviews</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-500">
              <tr>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.reviews.map((r) => (
                <tr key={r._id} className="border-t border-slate-800">
                  <td className="p-3">{r.subjectName}</td>
                  <td className="p-3 text-center">{r.hours}</td>
                  <td className="p-3">{formatCurrency(r.finalAmount)}</td>
                  <td className="p-3">{formatDate(r.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 mb-3 font-semibold">Transactions</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-500">
              <tr>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3">Date</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((t) => (
                <tr key={t._id} className="border-t border-slate-800">
                  <td className="p-3">{formatCurrency(t.amountPaid)}</td>
                  <td className="p-3">{formatDate(t.paymentDate)}</td>
                  <td className="p-3">{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
