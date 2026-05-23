'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { UserRole } from '@/types';

const nav = [
  { href: '/user/dashboard', label: 'Dashboard' },
  { href: '/user/reviews', label: 'Reviews' },
  { href: '/user/transactions', label: 'Transactions' },
  { href: '/user/profile', label: 'Profile' },
];

export default function UserDashboardPage() {
  return (
    <ProtectedRoute allowed={[UserRole.USER]}>
      <DashboardLayout nav={nav} title="My Account">
        <DashboardView />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
