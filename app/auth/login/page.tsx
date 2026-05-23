'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiLogin } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { getRoleHomePath } from '@/lib/auth';
import { UserRole } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SUBSCRIBER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiLogin(email, password, role);
      setSession(res);
      router.push(getRoleHomePath(res.user.type));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-2xl font-bold text-white">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">EduTracker — Admin, Subscriber, or User</p>

        <label className="mt-6 block text-sm text-slate-400">Role</label>
        <select
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          {Object.values(UserRole).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label className="mt-4 block text-sm text-slate-400">Email</label>
        <input
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mt-4 block text-sm text-slate-400">Password</label>
        <input
          type="password"
          required
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-emerald-500 py-2.5 font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Subscriber?{' '}
          <Link href="/auth/signup" className="text-emerald-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
