'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RowActionsMenu } from '@/components/ui/RowActionsMenu';
import { DataTable, Column, tableRowKey } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { UserFormModal } from '@/components/forms/UserFormModal';
import { apiDeleteUser, apiGetUsers } from '@/lib/api';
import { SUBSCRIBER_NAV } from '@/lib/adminNav';
import { exportToCsv, formatCurrency, getEntityId } from '@/lib/utils';
import type { EndUser } from '@/types';
import { UserRole } from '@/types';
import { FormField, TextInput } from '@/components/ui/FormField';

export default function SubscriberUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<EndUser[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EndUser | null>(null);

  const load = useCallback(() => {
    apiGetUsers({ search, limit: 50 }).then((r) => setUsers(r.data));
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!id || !window.confirm('Delete this user?')) return;
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
      header: 'Subjects & rates',
      hideOnMobile: true,
      render: (u) =>
        u.subjects?.length
          ? u.subjects.map((s) => `${s.subjectName} (${formatCurrency(s.amountPerHour)}/hr)`).join(', ')
          : '—',
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      className: 'w-[72px]',
      render: (u) => {
        const id = getEntityId(u);
        return (
          <RowActionsMenu
            menuId={`sub-user-menu-${id}`}
            actions={[
              { label: 'Details', onClick: () => router.push(`/subscriber/users/${id}`), disabled: !id },
              { label: 'Edit', onClick: () => { setEditing(u); setModalOpen(true); } },
              { label: 'Delete', variant: 'danger', onClick: () => handleDelete(id), disabled: !id },
            ]}
          />
        );
      },
    },
  ];

  return (
    <ProtectedRoute allowed={[UserRole.SUBSCRIBER]}>
      <DashboardLayout nav={[...SUBSCRIBER_NAV]} title="Subscriber Panel">
        <PageHeader
          title="Users"
          description="Create students with subject hourly rates for automatic review billing."
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => exportToCsv(users as unknown as Record<string, unknown>[], 'users.csv')}
              >
                Export CSV
              </Button>
              <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
                + Add User
              </Button>
            </>
          }
        />

        <div className="mb-6 max-w-sm">
          <FormField label="Search">
            <TextInput
              placeholder="Name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormField>
        </div>

        <DataTable columns={columns} data={users} rowKey={tableRowKey} mobileTitleKey="fullName" emptyMessage="No users found" />

        <UserFormModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={load}
          user={editing}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
