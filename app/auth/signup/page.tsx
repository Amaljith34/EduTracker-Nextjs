'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRegister } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { getRoleHomePath } from '@/lib/auth';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRegister(email, password, fullName, phone);
      setSession(res);
      router.push(getRoleHomePath(res.user.type));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-2xl font-bold">Subscriber registration</h1>
        <label className="mt-4 block text-sm text-slate-400">Full name</label>
        <input required className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <label className="mt-4 block text-sm text-slate-400">Email</label>
        <input required type="email" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="mt-4 block text-sm text-slate-400">Phone</label>
        <input required className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <label className="mt-4 block text-sm text-slate-400">Password</label>
        <input required type="password" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-lg bg-emerald-500 py-2.5 font-medium text-slate-950">
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Have an account? <Link href="/auth/login" className="text-emerald-400">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
