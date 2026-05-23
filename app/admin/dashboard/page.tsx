'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { UserRole } from '@/types';

import { ADMIN_NAV } from '@/lib/adminNav';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowed={[UserRole.ADMIN]}>
      <DashboardLayout nav={[...ADMIN_NAV]} title="Admin Panel">
        <DashboardView showAdminStats />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
