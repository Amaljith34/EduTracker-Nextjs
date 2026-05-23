'use client';

import { TransactionsPageContent } from '@/components/pages/TransactionsPageContent';
import { USER_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function UserTransactionsPage() {
  return (
    <TransactionsPageContent
      nav={[...USER_NAV]}
      layoutTitle="Student Panel"
      allowedRoles={[UserRole.USER]}
      canEdit={false}
    />
  );
}
