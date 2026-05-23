'use client';

import { FormEvent, useState } from 'react';
import { apiCreateReview } from '@/lib/api';
import { REVIEW_TYPE_OPTIONS, ReviewType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField, SelectInput, TextArea, TextInput } from '@/components/ui/FormField';

interface Props {
  onClose: () => void;
  onAdded: () => void;
  userId: string;
  subjectName: string;
  amountPerHour?: number;
}

export default function AddReviewModal({
  onClose,
  onAdded,
  userId,
  subjectName,
  amountPerHour = 0,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    reviewType: 'weekly' as ReviewType,
    hours: '1',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const calculated = amountPerHour * Number(form.hours || 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiCreateReview({
        userId,
        subjectName,
        hours: Number(form.hours),
        finalAmount: calculated,
        date: form.date,
        notes: form.notes ? `[${form.reviewType}] ${form.notes}` : `[${form.reviewType}]`,
      });
      onAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} title="Add Review" subtitle={subjectName} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Review type">
          <SelectInput
            value={form.reviewType}
            onChange={(e) => setForm({ ...form, reviewType: e.target.value as ReviewType })}
          >
            {REVIEW_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label="Hours">
          <TextInput
            type="number"
            min={0.25}
            step={0.25}
            required
            value={form.hours}
            onChange={(e) => setForm({ ...form, hours: e.target.value })}
          />
        </FormField>
        <FormField label="Date">
          <TextInput
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </FormField>
        <FormField label="Notes">
          <TextArea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </FormField>
        <p className="text-sm text-slate-500">Estimated amount: ₹{calculated.toFixed(2)}</p>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Saving…' : 'Add Review'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
