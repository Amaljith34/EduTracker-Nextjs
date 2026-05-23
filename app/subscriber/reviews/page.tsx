'use client';

import { ReviewsPageContent } from '@/components/pages/ReviewsPageContent';
import { SUBSCRIBER_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function SubscriberReviewsPage() {
  return (
    <ReviewsPageContent
      nav={[...SUBSCRIBER_NAV]}
      layoutTitle="Subscriber Panel"
      allowedRoles={[UserRole.SUBSCRIBER]}
    />
  );
}
