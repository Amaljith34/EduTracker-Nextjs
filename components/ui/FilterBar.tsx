'use client';

import type { DatePeriod, ListFilters } from '@/types';

interface FilterBarProps {
  filters: ListFilters;
  onChange: (filters: ListFilters) => void;
  showUserFilter?: boolean;
  users?: Array<{ _id: string; fullName: string }>;
}

export function FilterBar({ filters, onChange, showUserFilter, users }: FilterBarProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      {showUserFilter && users && (
        <select
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          value={filters.userId || ''}
          onChange={(e) => onChange({ ...filters, userId: e.target.value || undefined })}
        >
          <option value="">All users</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.fullName}
            </option>
          ))}
        </select>
      )}
      <input
        type="date"
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        value={filters.fromDate || ''}
        onChange={(e) => onChange({ ...filters, fromDate: e.target.value || undefined, period: undefined })}
      />
      <input
        type="date"
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        value={filters.toDate || ''}
        onChange={(e) => onChange({ ...filters, toDate: e.target.value || undefined, period: undefined })}
      />
      {(['week', 'month', 'year'] as DatePeriod[]).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange({ ...filters, period: p, fromDate: undefined, toDate: undefined })}
          className={`rounded-lg px-3 py-2 text-sm capitalize ${
            filters.period === p ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 text-slate-400'
          }`}
        >
          This {p}
        </button>
      ))}
    </div>
  );
}
