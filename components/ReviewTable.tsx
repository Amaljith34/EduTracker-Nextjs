'use client';
import { Review, REVIEW_TYPE_LABELS, ReviewType } from '@/types';

interface Props {
  reviews: Review[];
  onDelete: (id: string) => void;
  onEdit:   (review: Review) => void;
}

const TYPE_BADGE: Record<ReviewType, string> = {
  review:        'badge-review',
  session:       'badge-session',
  group_session: 'badge-group-session',
  group_project: 'badge-group-project',
};

export default function ReviewTable({ reviews, onDelete, onEdit }: Props) {
  if (reviews.length === 0) {
    return (
      <div className="rt-empty">
        <span className="rt-empty-icon">📭</span>
        <p className="rt-empty-title" style={{color:'#e5e7eb'}}>No entries found</p>
        <p className="rt-empty-sub" style={{color:'#9ca3af'}}>Try a different search or add a new entry.</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table ── */}
      <div className="rt-desktop">
        <table className="rt-table">
          <thead>
            <tr className="rt-head-row">
              {['#', 'Intern / Student', 'Type', 'Advisor', 'Date', 'Notes', ''].map((h) => (
                <th key={h} className="rt-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, i) => (
              <tr key={r.id} className="rt-row">
                <td className="rt-td rt-num">{String(i + 1).padStart(2, '0')}</td>
                <td className="rt-td rt-name">{r.intern_name}</td>
                <td className="rt-td">
                  <span className={`rt-badge ${TYPE_BADGE[r.type]}`}>{REVIEW_TYPE_LABELS[r.type]}</span>
                </td>
                <td className="rt-td rt-advisor">{r.advisor_name}</td>
                <td className="rt-td rt-date">
                  {new Date(r.review_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="rt-td rt-notes">{r.notes || <span className="rt-dash">—</span>}</td>
                <td className="rt-td rt-actions">
                  <div className="rt-btn-group">
                    <button onClick={() => onEdit(r)} className="rt-btn rt-btn-edit">Edit</button>
                    <button onClick={() => onDelete(r.id)} className="rt-btn rt-btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list ── */}
      <div className="rt-mobile">
        {reviews.map((r, i) => (
          <div key={r.id} className="rt-card">
            <div className="rt-card-top">
              <div className="rt-card-left">
                <span className="rt-card-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="rt-card-name">{r.intern_name}</p>
                  <p className="rt-card-advisor">{r.advisor_name || '—'}</p>
                </div>
              </div>
              <span className={`rt-badge ${TYPE_BADGE[r.type]}`}>{REVIEW_TYPE_LABELS[r.type]}</span>
            </div>
            <div className="rt-card-bottom">
              <span className="rt-card-date">
                {new Date(r.review_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {r.notes && <span className="rt-card-notes">{r.notes}</span>}
              <div className="rt-card-actions">
                <button onClick={() => onEdit(r)} className="rt-btn rt-btn-edit">Edit</button>
                <button onClick={() => onDelete(r.id)} className="rt-btn rt-btn-delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style suppressHydrationWarning>{`
        .rt-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 1rem;text-align:center;}
        .rt-empty-icon{font-size:2.5rem;margin-bottom:.75rem;}
        .rt-empty-title{font-size:1rem;font-weight:600;color:#9ca3af;margin:0 0 .25rem;}
        .rt-empty-sub{font-size:.82rem;color:#374151;margin:0;}

        /* Desktop */
        .rt-desktop{overflow-x:auto;-webkit-overflow-scrolling:touch;}
        @media(max-width:640px){.rt-desktop{display:none;}}
        .rt-table{width:100%;border-collapse:collapse;font-size:.875rem;}
        .rt-head-row{border-bottom:1px solid #1f2937;}
        .rt-th{padding:.6rem .75rem;text-align:left;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#4b5563;white-space:nowrap;}
        .rt-row{border-bottom:1px solid #111827;transition:background .12s;}
        .rt-row:hover{background:#0d1117;}
        .rt-row:hover .rt-btn-group{visibility:visible;}
        .rt-td{padding:.85rem .75rem;vertical-align:middle;}
        .rt-num{color:#374151;font-family:monospace;font-size:.75rem;width:32px;}
        .rt-name{font-weight:600;color:#f1f5f9;}
        .rt-advisor{color:#94a3b8;}
        .rt-date{color:#64748b;white-space:nowrap;}
        .rt-notes{color:#475569;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .rt-dash{font-style:italic;}
        .rt-actions{text-align:right;width:120px;}
        .rt-btn-group{visibility:hidden;display:flex;align-items:center;justify-content:flex-end;gap:.35rem;}

        /* Mobile cards */
        .rt-mobile{display:none;flex-direction:column;gap:.6rem;}
        @media(max-width:640px){.rt-mobile{display:flex;}}
        .rt-card{background:#0d1117;border:1px solid #1f2937;border-radius:12px;padding:.9rem;}
        .rt-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem;margin-bottom:.6rem;}
        .rt-card-left{display:flex;align-items:center;gap:.6rem;min-width:0;}
        .rt-card-num{font-size:.7rem;font-family:monospace;color:#374151;flex-shrink:0;}
        .rt-card-name{font-size:.9rem;font-weight:600;color:#f1f5f9;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .rt-card-advisor{font-size:.75rem;color:#4b5563;margin:0;}
        .rt-card-bottom{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;}
        .rt-card-date{font-size:.75rem;color:#4b5563;white-space:nowrap;}
        .rt-card-notes{font-size:.75rem;color:#374151;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .rt-card-actions{display:flex;gap:.4rem;margin-left:auto;}

        /* Badges */
        .rt-badge{display:inline-flex;align-items:center;padding:.25rem .65rem;border-radius:999px;font-size:.7rem;font-weight:700;white-space:nowrap;}
        .badge-review{background:rgba(99,102,241,.15);color:#a5b4fc;border:1px solid rgba(99,102,241,.25);}
        .badge-session{background:rgba(16,185,129,.15);color:#6ee7b7;border:1px solid rgba(16,185,129,.25);}
        .badge-group-session{background:rgba(245,158,11,.15);color:#fcd34d;border:1px solid rgba(245,158,11,.25);}
        .badge-group-project{background:rgba(239,68,68,.15);color:#fca5a5;border:1px solid rgba(239,68,68,.25);}

        /* Buttons */
        .rt-btn{padding:.3rem .65rem;border-radius:7px;font-size:.75rem;font-weight:600;cursor:pointer;border:none;transition:background .12s,color .12s;}
        .rt-btn-edit{background:rgba(99,102,241,.1);color:#818cf8;}
        .rt-btn-edit:hover{background:rgba(99,102,241,.2);}
        .rt-btn-delete{background:rgba(239,68,68,.08);color:#f87171;}
        .rt-btn-delete:hover{background:rgba(239,68,68,.18);}
      `}</style>
    </>
  );
}