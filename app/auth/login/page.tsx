'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiLogin } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { getRoleHomePath } from '@/lib/auth';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { FormField, SelectInput, TextInput } from '@/components/ui/FormField';

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07090f] px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-4xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">EduTracker</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
            Modern billing & review management for educators
          </h1>
          <p className="mt-4 text-slate-400">
            Track student reviews, subject rates, payments, and analytics in one beautiful dashboard.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-500">
            <li>✓ Subject-based hourly billing</li>
            <li>✓ Review & payment tracking</li>
            <li>✓ Revenue charts & exports</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="glass-card w-full max-w-md justify-self-center lg:max-w-none">
          <h2 className="text-2xl font-bold text-white">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Admin, Subscriber, or User account</p>

          <div className="mt-6 space-y-4">
            <FormField label="Role">
              <SelectInput value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                {Object.values(UserRole).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </SelectInput>
            </FormField>
            <FormField label="Email">
              <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormField>
            <FormField label="Password">
              <TextInput
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormField>
          </div>

          {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

          <Button type="submit" disabled={loading} className="mt-6 w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>

          <p className="mt-4 text-center text-sm text-slate-500">
            New subscriber?{' '}
            <Link href="/auth/signup" className="font-medium text-emerald-400 hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
