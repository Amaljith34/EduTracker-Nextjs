'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RowActionsMenu } from '@/components/ui/RowActionsMenu';
import { DataTable, Column, tableRowKey } from '@/components/ui/DataTable';
import { apiCreateSubscriber, apiDeleteSubscriber, apiGetSubscribers } from '@/lib/api';
import { ADMIN_NAV } from '@/lib/adminNav';
import { getEntityId } from '@/lib/utils';
import type { AuthUser } from '@/types';
import { UserRole } from '@/types';

export default function AdminSubscribersPage() {
  const router = useRouter();
  const [items, setItems] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });

  const load = useCallback(() => {
    return apiGetSubscribers({ limit: 50, search: search || undefined }).then((r) =>
      setItems(r.data),
    );
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    await apiCreateSubscriber(form);
    setForm({ fullName: '', email: '', phone: '', password: '' });
    load();
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!id) return;
      if (!window.confirm('Delete this subscriber? This cannot be undone.')) return;
      try {
        await apiDeleteSubscriber(id);
        await load();
      } catch (err) {
        window.alert(err instanceof Error ? err.message : 'Delete failed');
      }
    },
    [load],
  );

  const handleDetails = useCallback(
    (id: string) => {
      if (!id) {
        window.alert('Invalid subscriber id');
        return;
      }
      router.push(`/admin/subscribers/${id}`);
    },
    [router],
  );

  const columns: Column<AuthUser>[] = [
    { key: 'fullName', header: 'Name', className: 'min-w-[140px]' },
    { key: 'email', header: 'Email', className: 'min-w-[180px]' },
    { key: 'phone', header: 'Phone', render: (s) => s.phone || '—' },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (s) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            s.status === 'Hold'
              ? 'bg-red-500/20 text-red-300'
              : 'bg-emerald-500/20 text-emerald-300'
          }`}
        >
          {s.status === 'Hold' ? 'Blocked' : 'Active'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'w-[72px]',
      render: (s) => {
        const id = getEntityId(s);
        return (
          <RowActionsMenu
            menuId={`subscriber-menu-${id}`}
            actions={[
              {
                label: 'Details',
                onClick: () => handleDetails(id),
              },
              {
                label: 'Delete',
                variant: 'danger',
                onClick: () => handleDelete(id),
                disabled: !id,
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <ProtectedRoute allowed={[UserRole.ADMIN]}>
      <DashboardLayout nav={[...ADMIN_NAV]} title="Admin Panel">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Subscriber Management</h2>
          <input
            placeholder="Search subscribers..."
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <form
          onSubmit={onCreate}
          className="mb-6 grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-4"
        >
          {(['fullName', 'email', 'phone', 'password'] as const).map((f) => (
            <input
              key={f}
              required={f !== 'phone'}
              placeholder={f}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
            />
          ))}
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 py-2 text-sm font-medium text-slate-950 md:col-span-4"
          >
            Create Subscriber
          </button>
        </form>

        <DataTable
          columns={columns}
          data={items}
          rowKey={tableRowKey}
          mobileTitleKey="fullName"
          emptyMessage="No subscribers found"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
