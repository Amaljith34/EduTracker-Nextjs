'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RowActionsMenu } from '@/components/ui/RowActionsMenu';
import { DataTable, Column, tableRowKey } from '@/components/ui/DataTable';
import { apiCreateUser, apiDeleteUser, apiGetUsers } from '@/lib/api';
import { SUBSCRIBER_NAV } from '@/lib/adminNav';
import { exportToCsv, getEntityId } from '@/lib/utils';
import type { EndUser } from '@/types';
import { UserRole } from '@/types';

export default function SubscriberUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<EndUser[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    subjectName: '',
    amountPerHour: '',
  });

  const load = useCallback(() => {
    apiGetUsers({ search, limit: 50 }).then((r) => setUsers(r.data));
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    const subjects = form.subjectName
      ? [{ subjectName: form.subjectName, amountPerHour: Number(form.amountPerHour) }]
      : [];
    await apiCreateUser({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      subjects,
    });
    setShowForm(false);
    load();
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!id) return;
      if (!window.confirm('Delete this user?')) return;
      try {
        await apiDeleteUser(id);
        load();
      } catch (err) {
        window.alert(err instanceof Error ? err.message : 'Delete failed');
      }
    },
    [load],
  );

  const columns: Column<EndUser>[] = [
    { key: 'fullName', header: 'Name', className: 'min-w-[120px]' },
    { key: 'email', header: 'Email', className: 'min-w-[160px]' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'subjects',
      header: 'Subjects',
      hideOnMobile: true,
      render: (u) => u.subjects?.map((s) => s.subjectName).join(', ') || '—',
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'w-[72px]',
      render: (u) => {
        const id = getEntityId(u);
        return (
          <RowActionsMenu
            menuId={`sub-user-menu-${id}`}
            actions={[
              {
                label: 'Details',
                onClick: () => router.push(`/subscriber/users/${id}`),
                disabled: !id,
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
    <ProtectedRoute allowed={[UserRole.SUBSCRIBER]}>
      <DashboardLayout nav={[...SUBSCRIBER_NAV]} title="Subscriber Panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Users</h2>
          <div className="flex flex-wrap gap-2">
            <input
              placeholder="Search..."
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              onClick={() => exportToCsv(users as unknown as Record<string, unknown>[], 'users.csv')}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950"
            >
              Add User
            </button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={onCreate}
            className="mt-4 grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-2"
          >
            {(['fullName', 'email', 'phone', 'password', 'subjectName', 'amountPerHour'] as const).map(
              (f) => (
                <input
                  key={f}
                  required={f !== 'amountPerHour' && f !== 'subjectName'}
                  placeholder={f}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                />
              ),
            )}
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 py-2 text-sm font-medium text-slate-950 md:col-span-2"
            >
              Create User
            </button>
          </form>
        )}

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={users}
            rowKey={tableRowKey}
            mobileTitleKey="fullName"
            emptyMessage="No users found"
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
