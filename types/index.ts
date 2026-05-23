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

export interface Review {
  _id: string;
  userId: string;
  subscriberId: string;
  subjectName: string;
  amountPerHour: number;
  hours: number;
  calculatedAmount: number;
  finalAmount: number;
  date: string;
  notes?: string;
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
