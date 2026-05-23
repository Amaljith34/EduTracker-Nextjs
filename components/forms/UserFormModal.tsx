'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField, TextInput } from '@/components/ui/FormField';
import { apiCreateUser, apiUpdateUser } from '@/lib/api';
import type { EndUser, Subject } from '@/types';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  user?: EndUser | null;
}

export function UserFormModal({ open, onClose, onSaved, user }: UserFormModalProps) {
  const isEdit = Boolean(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [subjects, setSubjects] = useState<Subject[]>([{ subjectName: '', amountPerHour: 0 }]);

  useEffect(() => {
    if (!open) return;
    if (user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        password: '',
      });
      setSubjects(
        user.subjects?.length
          ? user.subjects.map((s) => ({ ...s }))
          : [{ subjectName: '', amountPerHour: 0 }],
      );
    } else {
      setForm({ fullName: '', email: '', phone: '', password: '' });
      setSubjects([{ subjectName: '', amountPerHour: 0 }]);
    }
    setError('');
  }, [open, user]);

  const addSubject = () => setSubjects((s) => [...s, { subjectName: '', amountPerHour: 0 }]);
  const removeSubject = (i: number) =>
    setSubjects((s) => (s.length > 1 ? s.filter((_, idx) => idx !== i) : s));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const validSubjects = subjects.filter((s) => s.subjectName.trim());
    try {
      if (isEdit && user) {
        const payload: Record<string, unknown> = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          subjects: validSubjects.map((s) => ({
            subjectName: s.subjectName.trim(),
            amountPerHour: Number(s.amountPerHour),
          })),
        };
        if (form.password) payload.password = form.password;
        await apiUpdateUser(user._id, payload);
      } else {
        await apiCreateUser({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          subjects: validSubjects.map((s) => ({
            subjectName: s.subjectName.trim(),
            amountPerHour: Number(s.amountPerHour),
          })),
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit User' : 'Create User'}
      subtitle="Set subject rates — amounts auto-calculate on reviews"
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name">
            <TextInput required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </FormField>
          <FormField label="Phone">
            <TextInput required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <FormField label="Email">
            <TextInput required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label={isEdit ? 'New password (optional)' : 'Password'} hint={isEdit ? 'Leave blank to keep current' : 'Min 6 characters'}>
            <TextInput
              type="password"
              required={!isEdit}
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </FormField>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subjects & hourly rates</span>
            <Button type="button" variant="ghost" className="!py-1 !text-xs" onClick={addSubject}>
              + Add subject
            </Button>
          </div>
          <div className="space-y-2">
            {subjects.map((s, i) => (
              <div key={i} className="flex gap-2">
                <TextInput
                  placeholder="Subject name"
                  value={s.subjectName}
                  onChange={(e) => {
                    const next = [...subjects];
                    next[i] = { ...next[i], subjectName: e.target.value };
                    setSubjects(next);
                  }}
                />
                <TextInput
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="₹/hr"
                  className="w-28 shrink-0"
                  value={s.amountPerHour || ''}
                  onChange={(e) => {
                    const next = [...subjects];
                    next[i] = { ...next[i], amountPerHour: Number(e.target.value) };
                    setSubjects(next);
                  }}
                />
                <Button type="button" variant="ghost" className="!px-2" onClick={() => removeSubject(i)}>
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>

        {error ? <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p> : null}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
