'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField, SelectInput, TextArea, TextInput } from '@/components/ui/FormField';
import { apiCreateTransaction, apiUpdateTransaction } from '@/lib/api';
import type { EndUser, Transaction } from '@/types';

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  users: EndUser[];
  transaction?: Transaction | null;
}

export function TransactionFormModal({
  open,
  onClose,
  onSaved,
  users,
  transaction,
}: TransactionFormModalProps) {
  const isEdit = Boolean(transaction);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    userId: '',
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (!open) return;
    if (transaction) {
      setForm({
        userId: transaction.userId,
        amountPaid: String(transaction.amountPaid),
        paymentDate: transaction.paymentDate.split('T')[0],
        notes: transaction.notes || '',
      });
    } else {
      setForm({
        userId: '',
        amountPaid: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setError('');
  }, [open, transaction]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        amountPaid: Number(form.amountPaid),
        paymentDate: form.paymentDate,
        notes: form.notes,
      };
      if (isEdit && transaction) {
        await apiUpdateTransaction(transaction._id, payload);
      } else {
        await apiCreateTransaction({ userId: form.userId, ...payload });
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
      title={isEdit ? 'Edit Payment' : 'Record Payment'}
      subtitle="Track student fee payments"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {!isEdit ? (
          <FormField label="Student / User">
            <SelectInput
              required
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
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
          <FormField label="Amount paid (₹)">
            <TextInput
              required
              type="number"
              min={0}
              step="0.01"
              value={form.amountPaid}
              onChange={(e) => setForm({ ...form, amountPaid: e.target.value })}
            />
          </FormField>
          <FormField label="Payment date">
            <TextInput
              required
              type="date"
              value={form.paymentDate}
              onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
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
            {loading ? 'Saving…' : isEdit ? 'Update Payment' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
