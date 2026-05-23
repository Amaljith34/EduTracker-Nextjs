'use client';

import { TransactionsPageContent } from '@/components/pages/TransactionsPageContent';
import { ADMIN_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function AdminTransactionsPage() {
  return (
    <TransactionsPageContent
      nav={[...ADMIN_NAV]}
      layoutTitle="Admin Panel"
      allowedRoles={[UserRole.ADMIN]}
    />
  );
}
