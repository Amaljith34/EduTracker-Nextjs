'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { apiCreateTransaction, apiGetTransactions, apiGetUsers } from '@/lib/api';
import type { EndUser, Transaction } from '@/types';
import { UserRole } from '@/types';
import { exportToCsv, formatCurrency, formatDate } from '@/lib/utils';
import { FilterBar } from '@/components/ui/FilterBar';

interface NavItem {
  href: string;
  label: string;
}

interface TransactionsPageContentProps {
  nav: NavItem[];
  layoutTitle: string;
  allowedRoles: UserRole[];
}

export function TransactionsPageContent({
  nav,
  layoutTitle,
  allowedRoles,
}: TransactionsPageContentProps) {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<EndUser[]>([]);
  const [filters, setFilters] = useState({});
  const [form, setForm] = useState({
    userId: '',
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    apiGetUsers({ limit: 100 }).then((r) => setUsers(r.data));
    apiGetTransactions(filters).then((r) => setTxns(r.data));
  }, [filters]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await apiCreateTransaction({ ...form, amountPaid: Number(form.amountPaid) });
    apiGetTransactions(filters).then((r) => setTxns(r.data));
  };

  return (
    <ProtectedRoute allowed={allowedRoles}>
      <DashboardLayout nav={nav} title={layoutTitle}>
        <h2 className="mb-4 text-2xl font-bold">Transactions</h2>
        <FilterBar filters={filters} onChange={setFilters} showUserFilter users={users} />
        <form
          onSubmit={onSubmit}
          className="mb-6 grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-4"
        >
          <select
            required
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.fullName}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            placeholder="Amount paid"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={form.amountPaid}
            onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
          />
          <input
            required
            type="date"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={form.paymentDate}
            onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 py-2 text-sm font-medium text-slate-950"
          >
            Record Payment
          </button>
        </form>
        <button
          type="button"
          className="mb-3 text-sm text-emerald-400"
          onClick={() =>
            exportToCsv(txns as unknown as Record<string, unknown>[], 'transactions.csv')
          }
        >
          Export CSV
        </button>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-500">
              <tr>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3">Date</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
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
