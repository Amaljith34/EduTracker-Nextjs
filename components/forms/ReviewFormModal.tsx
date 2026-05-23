'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField, SelectInput, TextArea, TextInput } from '@/components/ui/FormField';
import { apiCreateReview, apiUpdateReview } from '@/lib/api';
import { calcReviewAmount, formatCurrency } from '@/lib/utils';
import type { EndUser, Review } from '@/types';

interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  users: EndUser[];
  review?: Review | null;
}

export function ReviewFormModal({ open, onClose, onSaved, users, review }: ReviewFormModalProps) {
  const isEdit = Boolean(review);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    userId: '',
    subjectName: '',
    hours: '1',
    finalAmount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const selectedUser = users.find((u) => u._id === form.userId);
  const selectedSubject = selectedUser?.subjects?.find((s) => s.subjectName === form.subjectName);
  const calculated =
    selectedSubject && form.hours
      ? calcReviewAmount(selectedSubject.amountPerHour, Number(form.hours))
      : 0;

  useEffect(() => {
    if (!open) return;
    if (review) {
      setForm({
        userId: review.userId,
        subjectName: review.subjectName,
        hours: String(review.hours),
        finalAmount: String(review.finalAmount),
        date: review.date.split('T')[0],
        notes: review.notes || '',
      });
    } else {
      setForm({
        userId: '',
        subjectName: '',
        hours: '1',
        finalAmount: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setError('');
  }, [open, review]);

  useEffect(() => {
    if (!isEdit && selectedSubject && form.hours && !form.finalAmount) {
      setForm((f) => ({ ...f, finalAmount: String(calculated) }));
    }
  }, [calculated, selectedSubject, form.hours, isEdit, form.finalAmount]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        subjectName: form.subjectName,
        hours: Number(form.hours),
        finalAmount: Number(form.finalAmount || calculated),
        date: form.date,
        notes: form.notes,
      };
      if (isEdit && review) {
        await apiUpdateReview(review._id, payload);
      } else {
        await apiCreateReview({ userId: form.userId, ...payload });
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
      title={isEdit ? 'Edit Review' : 'Submit Review'}
      subtitle="Amount is calculated from subject hourly rate × hours"
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {!isEdit ? (
          <FormField label="Student / User">
            <SelectInput
              required
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value, subjectName: '', finalAmount: '' })}
            >
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.fullName}
                </option>
              ))}
            </SelectInput>
          </FormField>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Subject">
            <SelectInput
              required
              value={form.subjectName}
              onChange={(e) => setForm({ ...form, subjectName: e.target.value, finalAmount: '' })}
              disabled={!isEdit && !form.userId}
            >
              <option value="">Select subject</option>
              {(isEdit ? [{ subjectName: form.subjectName, amountPerHour: review?.amountPerHour ?? 0 }] : selectedUser?.subjects || []).map(
                (s) => (
                  <option key={s.subjectName} value={s.subjectName}>
                    {s.subjectName} ({formatCurrency(s.amountPerHour)}/hr)
                  </option>
                ),
              )}
            </SelectInput>
          </FormField>
          <FormField label="Hours">
            <SelectInput value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value, finalAmount: '' })}>
              {['0.5', '1', '1.5', '2', '2.5', '3', '4'].map((h) => (
                <option key={h} value={h}>
                  {h} hr
                </option>
              ))}
            </SelectInput>
          </FormField>
          <FormField label="Date">
            <TextInput required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </FormField>
          <FormField label="Final amount" hint={`Calculated: ${formatCurrency(calculated)}`}>
            <TextInput
              type="number"
              min={0}
              value={form.finalAmount}
              onChange={(e) => setForm({ ...form, finalAmount: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Notes">
          <TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional" />
        </FormField>

        {error ? <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p> : null}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Saving…' : isEdit ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
