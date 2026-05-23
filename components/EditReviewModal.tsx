'use client';

import { FormEvent, useState } from 'react';
import { apiUpdateReview } from '@/lib/api';
import { REVIEW_TYPE_OPTIONS, Review, ReviewType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField, SelectInput, TextArea, TextInput } from '@/components/ui/FormField';

interface Props {
  review: Review;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditReviewModal({ review, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    reviewType: (review.reviewType || 'weekly') as ReviewType,
    subjectName: review.subjectName,
    hours: String(review.hours),
    finalAmount: String(review.finalAmount),
    date: review.date.split('T')[0],
    notes: review.notes ?? '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const id = review._id || review.id;
    if (!id) {
      setError('Invalid review id');
      setLoading(false);
      return;
    }
    try {
      const typeTag = `[${form.reviewType}]`;
      const notes = form.notes.startsWith(typeTag) ? form.notes : `${typeTag} ${form.notes}`.trim();
      await apiUpdateReview(id, {
        subjectName: form.subjectName,
        hours: Number(form.hours),
        finalAmount: Number(form.finalAmount),
        date: form.date,
        notes,
      });
      onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} title="Edit Review" subtitle={review.subjectName} onClose={onClose}>
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
        <FormField label="Subject">
          <TextInput
            required
            value={form.subjectName}
            onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
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
          <FormField label="Final amount">
            <TextInput
              type="number"
              min={0}
              required
              value={form.finalAmount}
              onChange={(e) => setForm({ ...form, finalAmount: e.target.value })}
            />
          </FormField>
        </div>
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
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
