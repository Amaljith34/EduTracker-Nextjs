'use client';

import { Review, getReviewTypeLabel } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
  reviews: Review[];
  onDelete?: (id: string) => void;
  onEdit?: (review: Review) => void;
}

export default function ReviewTable({ reviews, onDelete, onEdit }: Props) {
  if (!reviews.length) {
    return (
      <div className="glass-card py-12 text-center text-sm text-slate-500">No reviews found</div>
    );
  }

  return (
    <div className="glass-card overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-500">
          <tr>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3">Type</th>
            <th className="p-3">Hours</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Date</th>
            {(onEdit || onDelete) && <th className="p-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => {
            const id = r._id || r.id || '';
            return (
              <tr key={id} className="border-t border-slate-800/80 hover:bg-slate-800/30">
                <td className="p-3 font-medium text-white">{r.subjectName}</td>
                <td className="p-3 text-slate-400">{getReviewTypeLabel(r.reviewType)}</td>
                <td className="p-3 text-center">{r.hours}</td>
                <td className="p-3 text-emerald-400">{formatCurrency(r.finalAmount)}</td>
                <td className="p-3 text-slate-400">{formatDate(r.date)}</td>
                {(onEdit || onDelete) && (
                  <td className="p-3 text-right">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(r)}
                        className="mr-2 text-emerald-400 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && id && (
                      <button
                        type="button"
                        onClick={() => onDelete(id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
