'use client';

import { TransactionsPageContent } from '@/components/pages/TransactionsPageContent';
import { SUBSCRIBER_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function SubscriberTransactionsPage() {
  return (
    <TransactionsPageContent
      nav={[...SUBSCRIBER_NAV]}
      layoutTitle="Subscriber Panel"
      allowedRoles={[UserRole.SUBSCRIBER]}
    />
  );
}
