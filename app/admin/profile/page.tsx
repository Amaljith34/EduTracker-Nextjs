'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ADMIN_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function AdminProfilePage() {
  return (
    <ProtectedRoute allowed={[UserRole.ADMIN]}>
      <DashboardLayout nav={[...ADMIN_NAV]} title="Admin Panel">
        <PageHeader title="Profile" description="Update your account details and password." />
        <ProfileForm />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
