'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { USER_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function UserDashboardPage() {
  return (
    <ProtectedRoute allowed={[UserRole.USER]}>
      <DashboardLayout nav={[...USER_NAV]} title="Student Panel">
        <DashboardView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
