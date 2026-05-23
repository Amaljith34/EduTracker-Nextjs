'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RowActionsMenu } from '@/components/ui/RowActionsMenu';
import { DataTable, Column } from '@/components/ui/DataTable';
import {
  apiCreateSubject,
  apiDeleteSubject,
  apiGetSubjects,
  apiUpdateSubject,
} from '@/lib/api';
import { ADMIN_NAV } from '@/lib/adminNav';
import { formatDate } from '@/lib/utils';
import type { SubjectCatalog, SubjectCatalogStatus } from '@/types';
import { UserRole } from '@/types';

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | SubjectCatalogStatus>('');
  const [form, setForm] = useState({
    subjectName: '',
    status: 'active' as SubjectCatalogStatus,
  });
  const [editing, setEditing] = useState<SubjectCatalog | null>(null);
  const [editForm, setEditForm] = useState({
    subjectName: '',
    status: 'active' as SubjectCatalogStatus,
  });

  const load = useCallback(() => {
    setLoading(true);
    apiGetSubjects(statusFilter || undefined)
      .then(setSubjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiCreateSubject(form);
      setForm({ subjectName: '', status: 'active' });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subject');
    }
  };

  const onUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setError('');
    try {
      await apiUpdateSubject(editing.subjectId, editForm);
      setEditing(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subject');
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!id) return;
      if (!window.confirm('Delete this subject?')) return;
      setError('');
      try {
        await apiDeleteSubject(id);
        load();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete subject');
      }
    },
    [load],
  );

  const handleEdit = useCallback((subject: SubjectCatalog) => {
    setEditing(subject);
    setEditForm({ subjectName: subject.subjectName, status: subject.status });
  }, []);

  const columns: Column<SubjectCatalog>[] = [
    {
      key: 'subjectId',
      header: 'Subject ID',
      hideOnMobile: true,
      render: (s) => (
        <span className="font-mono text-xs text-slate-400">{s.subjectId.slice(-8)}</span>
      ),
    },
    { key: 'subjectName', header: 'Subject Name', className: 'min-w-[160px]' },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (s) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
            s.status === 'active'
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-slate-600/40 text-slate-400'
          }`}
        >
          {s.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      hideOnMobile: true,
      render: (s) => (s.createdAt ? formatDate(s.createdAt) : '—'),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      className: 'w-[72px]',
      render: (s) => (
        <RowActionsMenu
          menuId={`subject-menu-${s.subjectId}`}
          actions={[
            { label: 'Edit', onClick: () => handleEdit(s) },
            {
              label: 'Delete',
              variant: 'danger',
              onClick: () => handleDelete(s.subjectId),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <ProtectedRoute allowed={[UserRole.ADMIN]}>
      <DashboardLayout nav={[...ADMIN_NAV]} title="Admin Panel">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Subject Management</h2>
            <p className="text-sm text-slate-500">
              Only admins can create subjects. Duplicate names are not allowed.
            </p>
          </div>
          <select
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as '' | SubjectCatalogStatus)}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form
          onSubmit={onCreate}
          className="mb-6 grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-3"
        >
          <input
            required
            minLength={2}
            placeholder="Subject name (e.g. Mathematics)"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm md:col-span-2"
            value={form.subjectName}
            onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
          />
          <select
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as SubjectCatalogStatus })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 py-2 text-sm font-medium text-slate-950 md:col-span-3"
          >
            Create Subject
          </button>
        </form>

        {editing && (
          <form
            onSubmit={onUpdate}
            className="mb-6 grid gap-3 rounded-xl border border-emerald-500/30 bg-slate-900 p-4 md:grid-cols-3"
          >
            <p className="text-sm font-medium text-emerald-300 md:col-span-3">
              Editing: {editing.subjectName}
            </p>
            <input
              required
              minLength={2}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm md:col-span-2"
              value={editForm.subjectName}
              onChange={(e) => setEditForm({ ...editForm, subjectName: e.target.value })}
            />
            <select
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              value={editForm.status}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value as SubjectCatalogStatus })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex gap-2 md:col-span-3">
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-slate-500">Loading subjects...</p>
        ) : (
          <DataTable
            columns={columns}
            data={subjects}
            rowKey={(s) => s.subjectId}
            mobileTitleKey="subjectName"
            emptyMessage="No subjects yet. Create one above."
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
