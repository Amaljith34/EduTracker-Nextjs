'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RowActionsMenu } from '@/components/ui/RowActionsMenu';
import { DataTable, Column, tableRowKey } from '@/components/ui/DataTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ReviewFormModal } from '@/components/forms/ReviewFormModal';
import {
  apiDeleteReview,
  apiGetReviews,
  apiGetUsers,
} from '@/lib/api';
import type { EndUser, ListFilters, Review } from '@/types';
import { UserRole } from '@/types';
import { exportToCsv, formatCurrency, formatDate, getEntityId } from '@/lib/utils';
import { FilterBar } from '@/components/ui/FilterBar';

interface NavItem {
  href: string;
  label: string;
}

interface ReviewsPageContentProps {
  nav: NavItem[];
  layoutTitle: string;
  allowedRoles: UserRole[];
  canEdit?: boolean;
}

export function ReviewsPageContent({
  nav,
  layoutTitle,
  allowedRoles,
  canEdit = true,
}: ReviewsPageContentProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<EndUser[]>([]);
  const [filters, setFilters] = useState<ListFilters>({ period: 'month' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);

  const load = useCallback(() => {
    apiGetReviews(filters).then((r) => setReviews(r.data));
  }, [filters]);

  useEffect(() => {
    if (canEdit) apiGetUsers({ limit: 100 }).then((r) => setUsers(r.data));
    load();
  }, [load, canEdit]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    await apiDeleteReview(id);
    load();
  };

  const columns: Column<Review>[] = [
    { key: 'subjectName', header: 'Subject', className: 'min-w-[120px]' },
    {
      key: 'hours',
      header: 'Hours',
      align: 'center',
      render: (r) => r.hours,
    },
    {
      key: 'calculatedAmount',
      header: 'Calculated',
      render: (r) => formatCurrency(r.calculatedAmount),
    },
    {
      key: 'finalAmount',
      header: 'Final',
      render: (r) => formatCurrency(r.finalAmount),
    },
    {
      key: 'date',
      header: 'Date',
      render: (r) => formatDate(r.date),
    },
    ...(canEdit
      ? [
          {
            key: 'actions',
            header: '',
            align: 'right' as const,
            className: 'w-[72px]',
            render: (r: Review) => {
              const id = getEntityId(r);
              return (
                <RowActionsMenu
                  menuId={`review-${id}`}
                  actions={[
                    { label: 'Edit', onClick: () => { setEditing(r); setModalOpen(true); } },
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
          title="Reviews"
          description="Submit session reviews with automatic subject-based billing."
          actions={
            canEdit ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => exportToCsv(reviews as unknown as Record<string, unknown>[], 'reviews.csv')}
                >
                  Export CSV
                </Button>
                <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
                  + Submit Review
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={() => exportToCsv(reviews as unknown as Record<string, unknown>[], 'reviews.csv')}
              >
                Export CSV
              </Button>
            )
          }
        />

        <FilterBar filters={filters} onChange={setFilters} showUserFilter={canEdit} users={users} />

        <DataTable columns={columns} data={reviews} rowKey={tableRowKey} mobileTitleKey="subjectName" emptyMessage="No reviews yet" />

        {canEdit ? (
          <ReviewFormModal
            open={modalOpen}
            onClose={() => { setModalOpen(false); setEditing(null); }}
            onSaved={load}
            users={users}
            review={editing}
          />
        ) : null}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
