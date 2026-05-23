'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiCreateReview, apiGetReviews, apiGetUsers } from '@/lib/api';
import type { EndUser, Review } from '@/types';
import { UserRole } from '@/types';
import { calcReviewAmount, exportToCsv, formatCurrency, formatDate } from '@/lib/utils';
import { FilterBar } from '@/components/ui/FilterBar';

interface NavItem {
  href: string;
  label: string;
}

interface ReviewsPageContentProps {
  nav: NavItem[];
  layoutTitle: string;
  allowedRoles: UserRole[];
}

export function ReviewsPageContent({
  nav,
  layoutTitle,
  allowedRoles,
}: ReviewsPageContentProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<EndUser[]>([]);
  const [filters, setFilters] = useState({ period: 'month' as const });
  const [form, setForm] = useState({
    userId: '',
    subjectName: '',
    hours: '1',
    finalAmount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [calculated, setCalculated] = useState(0);

  const selectedUser = users.find((u) => u._id === form.userId);
  const selectedSubject = selectedUser?.subjects?.find((s) => s.subjectName === form.subjectName);

  useEffect(() => {
    apiGetUsers({ limit: 100 }).then((r) => setUsers(r.data));
  }, []);

  useEffect(() => {
    apiGetReviews(filters).then((r) => setReviews(r.data));
  }, [filters]);

  useEffect(() => {
    if (selectedSubject && form.hours) {
      const amt = calcReviewAmount(selectedSubject.amountPerHour, Number(form.hours));
      setCalculated(amt);
      if (!form.finalAmount) setForm((f) => ({ ...f, finalAmount: String(amt) }));
    }
  }, [selectedSubject, form.hours, form.subjectName]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await apiCreateReview({
      userId: form.userId,
      subjectName: form.subjectName,
      hours: Number(form.hours),
      finalAmount: Number(form.finalAmount || calculated),
      date: form.date,
      notes: form.notes,
    });
    apiGetReviews(filters).then((r) => setReviews(r.data));
  };

  return (
    <ProtectedRoute allowed={allowedRoles}>
      <DashboardLayout nav={nav} title={layoutTitle}>
        <h2 className="mb-4 text-2xl font-bold">Review Management</h2>
        <FilterBar filters={filters} onChange={setFilters} showUserFilter users={users} />

        <form
          onSubmit={onSubmit}
          className="mb-6 grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-3"
        >
          <select
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value, subjectName: '' })}
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.fullName}
              </option>
            ))}
          </select>
          <select
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={form.subjectName}
            onChange={(e) => setForm({ ...form, subjectName: e.target.value, finalAmount: '' })}
          >
            <option value="">Select subject</option>
            {selectedUser?.subjects?.map((s) => (
              <option key={s.subjectName} value={s.subjectName}>
                {s.subjectName} ({formatCurrency(s.amountPerHour)}/hr)
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={form.hours}
            onChange={(e) => setForm({ ...form, hours: e.target.value, finalAmount: '' })}
          >
            {['1', '1.5', '2', '2.5', '3'].map((h) => (
              <option key={h} value={h}>
                {h} hour{h !== '1' ? 's' : ''}
              </option>
            ))}
          </select>
          <input
            type="date"
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <div>
            <p className="text-xs text-slate-500">Calculated: {formatCurrency(calculated)}</p>
            <input
              placeholder="Final amount (override)"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              value={form.finalAmount}
              onChange={(e) => setForm({ ...form, finalAmount: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 py-2 text-sm font-medium text-slate-950"
          >
            Add Review
          </button>
        </form>

        <button
          type="button"
          className="mb-3 text-sm text-emerald-400"
          onClick={() =>
            exportToCsv(reviews as unknown as Record<string, unknown>[], 'reviews.csv')
          }
        >
          Export CSV
        </button>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-500">
              <tr>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Calculated</th>
                <th className="p-3">Final</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="border-t border-slate-800">
                  <td className="p-3">{r.subjectName}</td>
                  <td className="p-3">{r.hours}</td>
                  <td className="p-3">{formatCurrency(r.calculatedAmount)}</td>
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
