'use client';
import { useState } from 'react';
import { apiUpdateReview } from '@/lib/api';
import { REVIEW_TYPE_OPTIONS, ReviewType, Review } from '@/types';

interface Props { review: Review; onClose: () => void; onUpdated: () => void; }

export default function EditReviewModal({ review, onClose, onUpdated }: Props) {
  const [form, setForm] = useState({
    intern_name:  review.intern_name,
    type:         review.type as ReviewType,
    advisor_name: review.advisor_name,
    review_date:  review.review_date,
    notes:        review.notes ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await apiUpdateReview(review.id, form);
      onUpdated(); onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}/>
      <div className="modal-wrap">
        <div className="modal-box">
          <div className="modal-header">
            <div>
              <h2 className="modal-title">Edit Entry</h2>
              <p className="modal-sub">Update review details</p>
            </div>
            <button onClick={onClose} className="modal-close">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="mf-field">
              <label className="mf-label">Intern / Student Name *</label>
              <input required value={form.intern_name}
                onChange={e => setForm({...form, intern_name: e.target.value})}
                className="mf-input"/>
            </div>

            <div className="mf-row">
              <div className="mf-field">
                <label className="mf-label">Type *</label>
                <select value={form.type}
                  onChange={e => setForm({...form, type: e.target.value as ReviewType})}
                  className="mf-input">
                  {REVIEW_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="mf-field">
                <label className="mf-label">Date *</label>
                <input type="date" required value={form.review_date}
                  onChange={e => setForm({...form, review_date: e.target.value})}
                  className="mf-input"/>
              </div>
            </div>

            <div className="mf-field">
              <label className="mf-label">Advisor Name *</label>
              <input required value={form.advisor_name}
                onChange={e => setForm({...form, advisor_name: e.target.value})}
                className="mf-input"/>
            </div>

            <div className="mf-field">
              <label className="mf-label">Notes</label>
              <textarea rows={3} value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                placeholder="Optional notes…" className="mf-input mf-textarea"/>
            </div>

            {error && <p className="mf-error">{error}</p>}

            <div className="mf-btns">
              <button type="button" onClick={onClose} className="mf-btn-cancel">Cancel</button>
              <button type="submit" disabled={loading} className="mf-btn-submit">
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style suppressHydrationWarning>{`
        .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:300;backdrop-filter:blur(3px);}
        .modal-wrap{position:fixed;inset:0;z-index:301;display:flex;align-items:flex-end;justify-content:center;}
        @media(min-width:600px){.modal-wrap{align-items:center;padding:1rem;}}
        .modal-box{width:100%;max-width:480px;background:#0d1117;border:1px solid #1f2937;border-radius:20px 20px 0 0;padding:1.5rem;max-height:92vh;overflow-y:auto;}
        @media(min-width:600px){.modal-box{border-radius:20px;max-height:88vh;}}
        .modal-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem;gap:1rem;}
        .modal-title{font-size:1.1rem;font-weight:700;color:#fff;margin:0 0 .2rem;}
        .modal-sub{font-size:.78rem;color:#4b5563;margin:0;}
        .modal-close{background:none;border:none;color:#4b5563;cursor:pointer;font-size:1rem;padding:4px;border-radius:6px;transition:color .15s,background .15s;flex-shrink:0;}
        .modal-close:hover{color:#e5e7eb;background:#1f2937;}
        .modal-form{display:flex;flex-direction:column;gap:1rem;}
        .mf-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;}
        @media(max-width:380px){.mf-row{grid-template-columns:1fr;}}
        .mf-field{display:flex;flex-direction:column;gap:.4rem;}
        .mf-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#4b5563;}
        .mf-input{width:100%;background:#111827;border:1.5px solid #1f2937;border-radius:10px;padding:.7rem .9rem;font-size:.88rem;color:#e5e7eb;outline:none;transition:border-color .15s,box-shadow .15s;font-family:inherit;}
        .mf-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12);}
        .mf-textarea{resize:none;}
        .mf-error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:8px;padding:.65rem .9rem;font-size:.82rem;color:#f87171;}
        .mf-btns{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;padding-top:.25rem;}
        .mf-btn-cancel{padding:.8rem;border-radius:10px;border:1.5px solid #1f2937;background:none;color:#9ca3af;font-size:.88rem;font-weight:600;cursor:pointer;transition:background .15s,color .15s;font-family:inherit;}
        .mf-btn-cancel:hover{background:#1f2937;color:#e5e7eb;}
        .mf-btn-submit{padding:.8rem;border-radius:10px;border:none;background:#00d4a4;color:#07090f;font-size:.88rem;font-weight:700;cursor:pointer;transition:background .15s;font-family:inherit;}
        .mf-btn-submit:hover{background:#00efb8;}
        .mf-btn-submit:disabled{opacity:.5;cursor:not-allowed;}
      `}</style>
    </>
  );
}
