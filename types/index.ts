export enum UserRole {
  ADMIN = 'Admin',
  SUBSCRIBER = 'Subscriber',
  USER = 'User',
}

export interface Subject {
  subjectName: string;
  amountPerHour: number;
}

export type SubjectCatalogStatus = 'active' | 'inactive';

export interface SubjectCatalog {
  subjectId: string;
  subjectName: string;
  status: SubjectCatalogStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser {
  id?: string;
  _id?: string;
  email: string;
  fullName: string;
  type: UserRole;
  phone?: string;
  subscriberId?: string;
  subjects?: Subject[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriberDetailResponse {
  subscriber: AuthUser;
  reviews: Review[];
  transactions: Transaction[];
  summary: {
    totalReviewAmount: number;
    totalPaid: number;
    remainingBalance: number;
  };
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/** Billing period / review cadence (used in filters, PDF export, legacy UI) */
export const REVIEW_TYPES = ['daily', 'weekly', 'monthly'] as const;

export type ReviewType = (typeof REVIEW_TYPES)[number];

export const REVIEW_TYPE_OPTIONS: ReadonlyArray<{ value: ReviewType; label: string }> = [
  { value: 'daily', label: 'Daily Review' },
  { value: 'weekly', label: 'Weekly Review' },
  { value: 'monthly', label: 'Monthly Review' },
];

export const REVIEW_TYPE_LABELS: Readonly<Record<ReviewType, string>> = {
  daily: 'Daily Review',
  weekly: 'Weekly Review',
  monthly: 'Monthly Review',
};

export function isReviewType(value: string): value is ReviewType {
  return (REVIEW_TYPES as readonly string[]).includes(value);
}

export function getReviewTypeLabel(type: ReviewType | string | undefined): string {
  if (type && isReviewType(type)) return REVIEW_TYPE_LABELS[type];
  return type || '—';
}

export interface Review {
  _id: string;
  id?: string;
  userId: string;
  subscriberId: string;
  subjectName: string;
  amountPerHour: number;
  hours: number;
  calculatedAmount: number;
  finalAmount: number;
  date: string;
  notes?: string;
  /** Optional cadence label for analytics / exports */
  reviewType?: ReviewType;
}

export interface Transaction {
  _id: string;
  userId: string;
  subscriberId: string;
  amountPaid: number;
  paymentDate: string;
  notes?: string;
}

export interface EndUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  subjects: Subject[];
  subscriberId?: string;
  status?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSubscribers: number;
  totalReviews: number;
  totalTransactions: number;
  totalAmount: number;
  totalPaid: number;
  remainingBalance: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  charts: {
    monthlyEarnings: Array<{ _id: { year: number; month: number }; total: number; count: number }>;
    reviewCountByMonth: Array<{ _id: { year: number; month: number }; total: number; count: number }>;
    paymentTracking: Array<{ _id: { year: number; month: number }; total: number; count: number }>;
    revenueAnalytics: Array<{ _id: { year: number; month: number }; total: number; count: number }>;
  };
}

export interface UserDetailResponse {
  user: EndUser;
  reviews: Review[];
  transactions: Transaction[];
  summary: {
    totalReviewAmount: number;
    totalPaid: number;
    remainingBalance: number;
  };
}

export type DatePeriod = 'week' | 'month' | 'year';

export interface ListFilters {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  period?: DatePeriod;
  subscriberId?: string;
}

/** @deprecated Use Review + subject billing fields; kept for legacy stats cards */
export interface ReviewStats {
  total_review: number;
  total_session: number;
  total_group_session: number;
  total_group_project: number;
}