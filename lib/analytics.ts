/**
 * lib/analytics.ts
 * Fetches analytics from the NestJS backend.
 * All computation logic lives in nest-backend/src/analytics/analytics.service.ts
 */
import { apiGetAnalytics } from './api';
import { Review, ReviewType } from '@/types';

export interface MonthlyTrend {
  month: string;
  review: number;
  session: number;
  group_session: number;
  group_project: number;
  total: number;
}

export interface AdvisorStat {
  advisor_name: string;
  total: number;
  review: number;
  session: number;
  group_session: number;
  group_project: number;
}

export interface InternStat {
  intern_name: string;
  count: number;
  lastDate: string;
}

export interface AnalyticsData {
  totalAllTime: number;
  totalThisMonth: number;
  totalToday: number;
  mostInADay: number;
  mostInADayDate: string;
  typeDistribution: { name: string; value: number; color: string }[];
  monthlyTrend: MonthlyTrend[];
  topAdvisors: AdvisorStat[];
  topInterns: InternStat[];
  recentActivity: Review[];
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  return apiGetAnalytics();
}
