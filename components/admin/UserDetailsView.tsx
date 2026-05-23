'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiGetUser } from '@/lib/api';
import type { UserDetailResponse } from '@/types';
import { formatCurrency, formatDate, getEntityId } from '@/lib/utils';
import { DataTable, Column } from '@/components/ui/DataTable';
import type { Review, Transaction } from '@/types';

interface UserDetailsViewProps {
  userId: string;
  backHref?: string;
}

export function UserDetailsView({ userId, backHref = '/admin/users' }: UserDetailsViewProps) {
  const [data, setData] = useState<UserDetailResponse | null>(null);

  useEffect(() => {
    apiGetUser(userId).then(setData);
  }, [userId]);

  if (!data) return <p className="text-slate-500">Loading user details...</p>;

  const reviewColumns: Column<Review>[] = [
    { key: 'subjectName', header: 'Subject' },
    { key: 'hours', header: 'Hours' },
    { key: 'finalAmount', header: 'Amount', render: (r) => formatCurrency(r.finalAmount) },
    { key: 'date', header: 'Date', render: (r) => formatDate(r.date) },
  ];

  const txnColumns: Column<Transaction>[] = [
    { key: 'amountPaid', header: 'Paid', render: (t) => formatCurrency(t.amountPaid) },
    { key: 'paymentDate', header: 'Date', render: (t) => formatDate(t.paymentDate) },
    { key: 'notes', header: 'Notes', render: (t) => t.notes || '—' },
  ];

  return (
    <div>
      <Link href={backHref} className="text-sm text-emerald-400 hover:underline">
        ← Back to Users
      </Link>
      <h2 className="mt-4 text-2xl font-bold">{data.user.fullName}</h2>
      <p className="text-slate-500">
        {data.user.email} · {data.user.phone}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-500">Total Review Amount</p>
          <p className="text-xl font-bold text-emerald-400">
            {formatCurrency(data.summary.totalReviewAmount)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-500">Total Paid</p>
          <p className="text-xl font-bold text-sky-400">
            {formatCurrency(data.summary.totalPaid)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-500">Remaining Balance</p>
          <p className="text-xl font-bold text-amber-400">
            {formatCurrency(data.summary.remainingBalance)}
          </p>
        </div>
      </div>

      <h3 className="mb-3 mt-8 font-semibold">Reviews</h3>
      <DataTable
        rowKey={(r) => getEntityId(r)}
        data={data.reviews}
        columns={reviewColumns}
      />

      <h3 className="mb-3 mt-8 font-semibold">Transactions</h3>
      <DataTable
        rowKey={(t) => getEntityId(t)}
        data={data.transactions}
        columns={txnColumns}
      />
    </div>
  );
}
