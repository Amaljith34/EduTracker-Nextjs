'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { apiUpdateProfile } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput } from '@/components/ui/FormField';
import { UserRole } from '@/types';

export function ProfileForm() {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const payload: Record<string, string> = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
      };
      if (form.password) payload.password = form.password;
      await apiUpdateProfile(payload);
      await refreshProfile();
      setMessage('Profile updated successfully');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="glass-card max-w-xl">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-600/20 text-2xl font-bold text-emerald-300">
          {user.fullName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{user.fullName}</p>
          <p className="text-sm text-slate-500">{user.type as UserRole}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Full name">
          <TextInput required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </FormField>
        <FormField label="Email">
          <TextInput required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Phone">
          <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </FormField>
        <FormField label="New password" hint="Leave blank to keep current password">
          <TextInput
            type="password"
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </FormField>

        {user.subjects && user.subjects.length > 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Your subjects</p>
            <ul className="space-y-1 text-sm text-slate-300">
              {user.subjects.map((s) => (
                <li key={s.subjectName}>
                  {s.subjectName} — ₹{s.amountPerHour}/hr
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
}
