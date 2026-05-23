'use client';

import { ReactNode } from 'react';
import { getEntityId } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Hide on mobile card, show in table */
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  rowKey: (row: T) => string;
  /** Label for mobile card primary field (defaults to first column) */
  mobileTitleKey?: string;
}

function alignClass(align?: 'left' | 'center' | 'right') {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = 'No records found',
  rowKey,
  mobileTitleKey,
}: DataTableProps<T>) {
  if (!data.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-12 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  const titleKey = mobileTitleKey || columns[0]?.key;
  const mobileColumns = columns.filter((c) => c.key !== 'actions' && !c.hideOnMobile);

  return (
    <div className="w-full">
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30 md:block">
        <table className="w-full min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${alignClass(col.align)} ${col.headerClassName || ''} ${col.className || ''}`}
                >
                  {col.header || (col.key === 'actions' ? 'Actions' : '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data.map((row, index) => (
              <tr
                key={rowKey(row) || `row-${index}`}
                className="transition-colors hover:bg-slate-800/30"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-4 py-3 align-middle text-slate-200 ${alignClass(col.align)} ${col.className || ''} ${col.key === 'actions' ? 'overflow-visible' : ''}`}
                  >
                    <div className={col.key === 'actions' ? 'relative flex justify-end' : ''}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {data.map((row, index) => {
          const id = rowKey(row) || `row-${index}`;
          const actionsCol = columns.find((c) => c.key === 'actions');
          return (
            <div
              key={id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-100">
                    {titleKey && (row as Record<string, unknown>)[titleKey] != null
                      ? String((row as Record<string, unknown>)[titleKey])
                      : 'Record'}
                  </p>
                </div>
                {actionsCol?.render && (
                  <div className="shrink-0">{actionsCol.render(row)}</div>
                )}
              </div>
              <dl className="grid grid-cols-1 gap-2 text-sm">
                {mobileColumns.slice(titleKey === mobileColumns[0]?.key ? 1 : 0).map((col) => (
                  <div key={col.key} className="flex justify-between gap-4 border-t border-slate-800/50 pt-2 first:border-0 first:pt-0">
                    <dt className="text-slate-500">{col.header}</dt>
                    <dd className={`text-right text-slate-200 ${alignClass(col.align)}`}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Helper when row may use _id from API */
export function tableRowKey<T extends { id?: string; _id?: string }>(row: T): string {
  return getEntityId(row) || 'unknown';
}
