'use client';

import { ReviewsPageContent } from '@/components/pages/ReviewsPageContent';
import { USER_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function UserReviewsPage() {
  return (
    <ReviewsPageContent
      nav={[...USER_NAV]}
      layoutTitle="Student Panel"
      allowedRoles={[UserRole.USER]}
      canEdit={false}
    />
  );
}
