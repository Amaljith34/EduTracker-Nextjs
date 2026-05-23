'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiGetTransactions } from '@/lib/api';
import type { Transaction } from '@/types';
import { UserRole } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const nav = [
  { href: '/user/dashboard', label: 'Dashboard' },
  { href: '/user/reviews', label: 'Reviews' },
  { href: '/user/transactions', label: 'Transactions' },
];

export default function UserTransactionsPage() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  useEffect(() => { apiGetTransactions({ limit: 50 }).then((r) => setTxns(r.data)); }, []);
  return (
    <ProtectedRoute allowed={[UserRole.USER]}>
      <DashboardLayout nav={nav} title="My Transactions">
        <h2 className="mb-4 text-2xl font-bold">Payment History</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-500"><tr><th className="p-3 text-left">Paid</th><th className="p-3">Date</th><th className="p-3">Notes</th></tr></thead>
            <tbody>
              {txns.map((t) => (
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
