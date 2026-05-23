'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiGetReviews } from '@/lib/api';
import type { Review } from '@/types';
import { UserRole } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const nav = [
  { href: '/user/dashboard', label: 'Dashboard' },
  { href: '/user/reviews', label: 'Reviews' },
  { href: '/user/transactions', label: 'Transactions' },
];

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => { apiGetReviews({ limit: 50 }).then((r) => setReviews(r.data)); }, []);
  return (
    <ProtectedRoute allowed={[UserRole.USER]}>
      <DashboardLayout nav={nav} title="My Reviews">
        <h2 className="mb-4 text-2xl font-bold">Reviews History</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-500"><tr><th className="p-3 text-left">Subject</th><th className="p-3">Hours</th><th className="p-3">Amount</th><th className="p-3">Date</th></tr></thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="border-t border-slate-800">
                  <td className="p-3">{r.subjectName}</td>
                  <td className="p-3">{r.hours}</td>
                  <td className="p-3">{formatCurrency(r.finalAmount)}</td>
                  <td className="p-3">{formatDate(r.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
