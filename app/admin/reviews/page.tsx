'use client';

import { ReviewsPageContent } from '@/components/pages/ReviewsPageContent';
import { ADMIN_NAV } from '@/lib/adminNav';
import { UserRole } from '@/types';

export default function AdminReviewsPage() {
  return (
    <ReviewsPageContent
      nav={[...ADMIN_NAV]}
      layoutTitle="Admin Panel"
      allowedRoles={[UserRole.ADMIN]}
    />
  );
}
