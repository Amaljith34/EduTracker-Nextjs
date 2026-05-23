'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGetSubscriberDetails } from '@/lib/api';
import type { SubscriberDetailResponse } from '@/types';
import { formatCurrency, formatDate, getEntityId } from '@/lib/utils';
import { Tabs } from '@/components/ui/Tabs';
import { DataTable, Column } from '@/components/ui/DataTable';
import type { Review, Transaction } from '@/types';

interface SubscriberDetailsViewProps {
  subscriberId: string;
  backHref?: string;
}

export function SubscriberDetailsView({
  subscriberId,
  backHref = '/admin/subscribers',
}: SubscriberDetailsViewProps) {
  const [data, setData] = useState<SubscriberDetailResponse | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetSubscriberDetails(subscriberId)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [subscriberId]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-slate-500">Loading subscriber details...</p>;

  const { subscriber, reviews, transactions, summary } = data;

  const generalRows = [
    { field: 'Full Name', value: subscriber.fullName },
    { field: 'Email', value: subscriber.email },
    { field: 'Phone', value: subscriber.phone || '—' },
    { field: 'Status', value: subscriber.status || 'Active' },
    { field: 'Role', value: subscriber.type },
    {
      field: 'Created At',
      value: subscriber.createdAt ? formatDate(subscriber.createdAt) : '—',
    },
    {
      field: 'Updated At',
      value: subscriber.updatedAt ? formatDate(subscriber.updatedAt) : '—',
    },
    { field: 'Total Review Amount', value: formatCurrency(summary.totalReviewAmount) },
    { field: 'Total Paid', value: formatCurrency(summary.totalPaid) },
    { field: 'Remaining Balance', value: formatCurrency(summary.remainingBalance) },
  ];

  const reviewColumns: Column<Review>[] = [
    { key: 'subjectName', header: 'Subject / Service' },
    {
      key: 'notes',
      header: 'Review Notes',
      render: (r) => r.notes || '—',
    },
    {
      key: 'hours',
      header: 'Duration',
      render: (r) => `${r.hours} hr`,
    },
    {
      key: 'finalAmount',
      header: 'Amount',
      render: (r) => formatCurrency(r.finalAmount),
    },
    {
      key: 'date',
      header: 'Date',
      render: (r) => formatDate(r.date),
    },
  ];

  const transactionColumns: Column<Transaction>[] = [
    {
      key: '_id',
      header: 'Transaction ID',
      render: (t) => (
        <span className="font-mono text-xs text-slate-400">
          {getEntityId(t).slice(-8)}
        </span>
      ),
    },
    {
      key: 'amountPaid',
      header: 'Amount',
      render: (t) => formatCurrency(t.amountPaid),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
          Completed
        </span>
      ),
    },
    {
      key: 'paymentDate',
      header: 'Date',
      render: (t) => formatDate(t.paymentDate),
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (t) => t.notes || '—',
    },
  ];

  const tabs = [
    {
      id: 'general',
      label: 'General Details',
      content: (
        <DataTable
          rowKey={(row) => row.field}
          data={generalRows}
          columns={[
            { key: 'field', header: 'Field', className: 'w-1/3 text-slate-500' },
            { key: 'value', header: 'Value' },
          ]}
        />
      ),
    },
    {
      id: 'reviews',
      label: 'Reviews',
      content: (
        <DataTable
          rowKey={(r) => getEntityId(r)}
          data={reviews}
          columns={reviewColumns}
          emptyMessage="No reviews for this subscriber"
        />
      ),
    },
    {
      id: 'transactions',
      label: 'Transactions',
      content: (
        <DataTable
          rowKey={(t) => getEntityId(t)}
          data={transactions}
          columns={transactionColumns}
          emptyMessage="No transactions for this subscriber"
        />
      ),
    },
  ];

  return (
    <div>
      <Link href={backHref} className="text-sm text-emerald-400 hover:underline">
        ← Back to Subscribers
      </Link>
      <h2 className="mt-4 text-2xl font-bold">{subscriber.fullName}</h2>
      <p className="text-slate-500">{subscriber.email}</p>
      <div className="mt-8">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}
