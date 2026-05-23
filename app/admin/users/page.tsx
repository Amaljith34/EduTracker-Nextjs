'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RowActionsMenu } from '@/components/ui/RowActionsMenu';
import { DataTable, Column, tableRowKey } from '@/components/ui/DataTable';
import { apiGetUsers } from '@/lib/api';
import { ADMIN_NAV } from '@/lib/adminNav';
import { getEntityId } from '@/lib/utils';
import type { EndUser } from '@/types';
import { UserRole } from '@/types';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<EndUser[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiGetUsers({ limit: 100, search: search || undefined }).then((r) => setUsers(r.data));
  }, [search]);

  const handleDetails = useCallback(
    (id: string) => {
      if (!id) return;
      router.push(`/admin/users/${id}`);
    },
    [router],
  );

  const columns: Column<EndUser>[] = [
    { key: 'fullName', header: 'Name', className: 'min-w-[140px]' },
    { key: 'email', header: 'Email', className: 'min-w-[180px]' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'w-[72px]',
      render: (u) => {
        const id = getEntityId(u);
        return (
          <RowActionsMenu
            menuId={`user-menu-${id}`}
            actions={[
              {
                label: 'Details',
                onClick: () => handleDetails(id),
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
          <h2 className="text-2xl font-bold">All Users</h2>
          <input
            placeholder="Search users..."
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DataTable
          columns={columns}
          data={users}
          rowKey={tableRowKey}
          mobileTitleKey="fullName"
          emptyMessage="No users found"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
