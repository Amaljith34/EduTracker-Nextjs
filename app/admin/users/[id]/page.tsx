'use client';

import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UserDetailsView } from '@/components/admin/UserDetailsView';
import { ADMIN_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function AdminUserDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <ProtectedRoute allowed={[UserRole.ADMIN]}>
      <DashboardLayout nav={[...ADMIN_NAV]} title="Admin Panel">
        {id && <UserDetailsView userId={id} backHref="/admin/users" />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
