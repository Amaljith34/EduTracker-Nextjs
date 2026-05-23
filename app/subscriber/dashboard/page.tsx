'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { UserRole } from '@/types';

const nav = [
  { href: '/subscriber/dashboard', label: 'Dashboard' },
  { href: '/subscriber/users', label: 'Users' },
  { href: '/subscriber/reviews', label: 'Reviews' },
  { href: '/subscriber/transactions', label: 'Transactions' },
  { href: '/subscriber/analytics', label: 'Analytics' },
];

export default function SubscriberDashboardPage() {
  return (
    <ProtectedRoute allowed={[UserRole.SUBSCRIBER]}>
      <DashboardLayout nav={nav} title="Subscriber Panel">
        <DashboardView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
