'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RowActionsMenu } from '@/components/ui/RowActionsMenu';
import { DataTable, Column, tableRowKey } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { TransactionFormModal } from '@/components/forms/TransactionFormModal';
import {
  apiDeleteTransaction,
  apiGetTransactions,
  apiGetUsers,
} from '@/lib/api';
import type { EndUser, ListFilters, Transaction } from '@/types';
import { UserRole } from '@/types';
import { exportToCsv, formatCurrency, formatDate, getEntityId } from '@/lib/utils';
import { FilterBar } from '@/components/ui/FilterBar';

interface NavItem {
  href: string;
  label: string;
}

interface TransactionsPageContentProps {
  nav: NavItem[];
  layoutTitle: string;
  allowedRoles: UserRole[];
  canEdit?: boolean;
}

export function TransactionsPageContent({
  nav,
  layoutTitle,
  allowedRoles,
  canEdit = true,
}: TransactionsPageContentProps) {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<EndUser[]>([]);
  const [filters, setFilters] = useState<ListFilters>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const load = useCallback(() => {
    apiGetTransactions(filters).then((r) => setTxns(r.data));
  }, [filters]);

  useEffect(() => {
    if (canEdit) apiGetUsers({ limit: 100 }).then((r) => setUsers(r.data));
    load();
  }, [load, canEdit]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    await apiDeleteTransaction(id);
    load();
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'amountPaid',
      header: 'Amount',
      render: (t) => formatCurrency(t.amountPaid),
    },
    {
      key: 'paymentDate',
      header: 'Date',
      render: (t) => formatDate(t.paymentDate),
    },
    { key: 'notes', header: 'Notes', render: (t) => t.notes || '—' },
    ...(canEdit
      ? [
          {
            key: 'actions',
            header: '',
            align: 'right' as const,
            className: 'w-[72px]',
            render: (t: Transaction) => {
              const id = getEntityId(t);
              return (
                <RowActionsMenu
                  menuId={`txn-${id}`}
                  actions={[
                    { label: 'Edit', onClick: () => { setEditing(t); setModalOpen(true); } },
                    { label: 'Delete', variant: 'danger' as const, onClick: () => handleDelete(id) },
                  ]}
                />
              );
            },
          },
        ]
      : []),
  ];

  return (
    <ProtectedRoute allowed={allowedRoles}>
      <DashboardLayout nav={nav} title={layoutTitle}>
        <PageHeader
          title="Transactions"
          description="Record and manage student fee payments."
          actions={
            canEdit ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => exportToCsv(txns as unknown as Record<string, unknown>[], 'transactions.csv')}
                >
                  Export CSV
                </Button>
                <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
                  + Record Payment
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => exportToCsv(txns as unknown as Record<string, unknown>[], 'transactions.csv')}
              >
                Export CSV
              </Button>
            )
          }
        />

        <FilterBar filters={filters} onChange={setFilters} showUserFilter={canEdit} users={users} />

        <DataTable columns={columns} data={txns} rowKey={tableRowKey} mobileTitleKey="amountPaid" emptyMessage="No transactions yet" />

        {canEdit ? (
          <TransactionFormModal
            open={modalOpen}
            onClose={() => { setModalOpen(false); setEditing(null); }}
            onSaved={load}
            users={users}
            transaction={editing}
          />
        ) : null}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
