'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { USER_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function UserProfilePage() {
  return (
    <ProtectedRoute allowed={[UserRole.USER]}>
      <DashboardLayout nav={[...USER_NAV]} title="Student Panel">
        <PageHeader title="Profile" description="Update your account details and password." />
        <ProfileForm />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
