/**
 * Central API client for NestJS backend
 */
import type {
  AuthResponse,
  AuthUser,
  DashboardData,
  EndUser,
  ListFilters,
  PaginatedResponse,
  Review,
  SubjectCatalog,
  SubjectCatalogStatus,
  SubscriberDetailResponse,
  Transaction,
  UserDetailResponse,
  UserRole,
} from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;
  const data: AuthResponse = await res.json();
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.access_token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401 && getRefreshToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function toQuery(filters?: ListFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v));
  });
  const q = params.toString();
  return q ? `?${q}` : '';
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiRegister(
  email: string,
  password: string,
  fullName: string,
  phone?: string,
): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, phone, type: 'Subscriber' }),
  });
}

export async function apiLogin(
  email: string,
  password: string,
  type: UserRole,
): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, type }),
  });
}

export async function apiLogout(): Promise<void> {
  await request('/auth/logout', { method: 'POST' });
}

export async function apiGetMe(): Promise<AuthUser> {
  return request<AuthUser>('/auth/me');
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function apiGetDashboard(filters?: ListFilters): Promise<DashboardData> {
  return request<DashboardData>(`/dashboard${toQuery(filters)}`);
}

export async function apiGetAnalytics(filters?: ListFilters): Promise<DashboardData> {
  return request<DashboardData>(`/analytics${toQuery(filters)}`);
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function apiGetUsers(filters?: ListFilters): Promise<PaginatedResponse<EndUser>> {
  return request(`/users${toQuery(filters)}`);
}

export async function apiGetUser(id: string): Promise<UserDetailResponse> {
  return request(`/users/${id}`);
}

export async function apiCreateUser(data: Record<string, unknown>): Promise<EndUser> {
  return request('/users', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiUpdateUser(id: string, data: Record<string, unknown>): Promise<EndUser> {
  return request(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function apiDeleteUser(id: string): Promise<void> {
  return request(`/users/${id}`, { method: 'DELETE' });
}

// ─── Subscribers ──────────────────────────────────────────────────────────────

export async function apiGetSubscribers(filters?: ListFilters): Promise<PaginatedResponse<AuthUser>> {
  return request(`/subscribers${toQuery(filters)}`);
}

export async function apiGetSubscriberDetails(id: string): Promise<SubscriberDetailResponse> {
  return request(`/subscribers/${id}/details`);
}

export async function apiCreateSubscriber(data: Record<string, unknown>): Promise<AuthUser> {
  return request('/subscribers', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiUpdateSubscriber(id: string, data: Record<string, unknown>): Promise<AuthUser> {
  return request(`/subscribers/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function apiDeleteSubscriber(id: string): Promise<void> {
  return request(`/subscribers/${id}`, { method: 'DELETE' });
}

// ─── Subject catalog (Admin CRUD) ─────────────────────────────────────────────

export async function apiGetSubjects(status?: SubjectCatalogStatus): Promise<SubjectCatalog[]> {
  const q = status ? `?status=${status}` : '';
  return request<SubjectCatalog[]>(`/subjects${q}`);
}

export async function apiGetSubject(id: string): Promise<SubjectCatalog> {
  return request<SubjectCatalog>(`/subjects/${id}`);
}

export async function apiCreateSubject(data: {
  subjectName: string;
  status?: SubjectCatalogStatus;
}): Promise<SubjectCatalog> {
  return request('/subjects', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiUpdateSubject(
  id: string,
  data: { subjectName?: string; status?: SubjectCatalogStatus },
): Promise<SubjectCatalog> {
  return request(`/subjects/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function apiDeleteSubject(id: string): Promise<void> {
  return request(`/subjects/${id}`, { method: 'DELETE' });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function apiGetReviews(filters?: ListFilters): Promise<PaginatedResponse<Review>> {
  return request(`/reviews${toQuery(filters)}`);
}

export async function apiCreateReview(data: Record<string, unknown>): Promise<Review> {
  return request('/reviews', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiUpdateReview(id: string, data: Record<string, unknown>): Promise<Review> {
  return request(`/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function apiDeleteReview(id: string): Promise<void> {
  return request(`/reviews/${id}`, { method: 'DELETE' });
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function apiGetTransactions(filters?: ListFilters): Promise<PaginatedResponse<Transaction>> {
  return request(`/transactions${toQuery(filters)}`);
}

export async function apiCreateTransaction(data: Record<string, unknown>): Promise<Transaction> {
  return request('/transactions', { method: 'POST', body: JSON.stringify(data) });
}

export async function apiUpdateTransaction(id: string, data: Record<string, unknown>): Promise<Transaction> {
  return request(`/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function apiDeleteTransaction(id: string): Promise<void> {
  return request(`/transactions/${id}`, { method: 'DELETE' });
}
