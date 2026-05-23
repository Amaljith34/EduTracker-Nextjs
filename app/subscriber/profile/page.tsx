'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { SUBSCRIBER_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function SubscriberProfilePage() {
  return (
    <ProtectedRoute allowed={[UserRole.SUBSCRIBER]}>
      <DashboardLayout nav={[...SUBSCRIBER_NAV]} title="Subscriber Panel">
        <PageHeader title="Profile" description="Update your account details and password." />
        <ProfileForm />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
