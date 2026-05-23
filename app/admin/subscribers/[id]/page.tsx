'use client';

import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SubscriberDetailsView } from '@/components/admin/SubscriberDetailsView';
import { ADMIN_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function AdminSubscriberDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <ProtectedRoute allowed={[UserRole.ADMIN]}>
      <DashboardLayout nav={[...ADMIN_NAV]} title="Admin Panel">
        {id && <SubscriberDetailsView subscriberId={id} backHref="/admin/subscribers" />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
