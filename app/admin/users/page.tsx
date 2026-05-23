'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RowActionsMenu } from '@/components/ui/RowActionsMenu';
import { DataTable, Column, tableRowKey } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { UserFormModal } from '@/components/forms/UserFormModal';
import { apiGetUsers } from '@/lib/api';
import { ADMIN_NAV } from '@/lib/adminNav';
import { getEntityId } from '@/lib/utils';
import type { EndUser } from '@/types';
import { UserRole } from '@/types';
import { FormField, TextInput } from '@/components/ui/FormField';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<EndUser[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EndUser | null>(null);

  const load = () => {
    apiGetUsers({ limit: 100, search: search || undefined }).then((r) => setUsers(r.data));
  };

  useEffect(() => {
    load();
  }, [search]);

  const columns: Column<EndUser>[] = [
    { key: 'fullName', header: 'Name', className: 'min-w-[140px]' },
    { key: 'email', header: 'Email', className: 'min-w-[180px]' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'actions',
      header: '',
      align: 'right',
      className: 'w-[72px]',
      render: (u) => {
        const id = getEntityId(u);
        return (
          <RowActionsMenu
            menuId={`user-menu-${id}`}
            actions={[
              { label: 'Details', onClick: () => router.push(`/admin/users/${id}`), disabled: !id },
              { label: 'Edit', onClick: () => { setEditing(u); setModalOpen(true); } },
            ]}
          />
        );
      },
    },
  ];

  return (
    <ProtectedRoute allowed={[UserRole.ADMIN]}>
      <DashboardLayout nav={[...ADMIN_NAV]} title="Admin Panel">
        <PageHeader
          title="All Users"
          description="Manage end users across subscribers."
          actions={
            <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
              + Add User
            </Button>
          }
        />

        <div className="mb-6 max-w-sm">
          <FormField label="Search">
            <TextInput
              placeholder="Search users…"
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
