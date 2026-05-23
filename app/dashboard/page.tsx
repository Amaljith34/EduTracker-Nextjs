'use client';
export const dynamic = 'force-dynamic';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { apiGetReviews, apiDeleteReview } from '@/lib/api';
import { Review, ReviewStats } from '@/types';
import StatsCards       from '@/components/StatsCards';
import ReviewTable      from '@/components/ReviewTable';
import AddReviewModal   from '@/components/AddReviewModal';
import EditReviewModal  from '@/components/EditReviewModal';
import MonthYearPicker  from '@/components/MonthYearPicker';
import Sidebar          from '@/components/Sidebar';
import { exportReviewsPDF } from '@/lib/exportPDF';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getDefaultMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

function calcStats(reviews: Review[]): ReviewStats {
  return {
    total_review:        reviews.filter(r => r.type === 'review').length,
    total_session:       reviews.filter(r => r.type === 'session').length,
    total_group_session: reviews.filter(r => r.type === 'group_session').length,
    total_group_project: reviews.filter(r => r.type === 'group_project').length,
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { month: initMonth, year: initYear } = getDefaultMonthYear();

  const [month, setMonth]           = useState(initMonth);
  const [year, setYear]             = useState(initYear);
  const [reviews, setReviews]       = useState<Review[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showAddModal, setShowAdd]  = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [search, setSearch]         = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGetReviews(month, year);
      setReviews(data);
    } catch (e) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { if (user) fetchReviews(); }, [fetchReviews, user]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(r =>
      r.intern_name.toLowerCase().includes(q) ||
      r.advisor_name.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      (r.notes ?? '').toLowerCase().includes(q)
    );
  }, [reviews, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await apiDeleteReview(id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleDownload = async () => {
    setPdfLoading(true);
    try { exportReviewsPDF(filtered, calcStats(filtered), month, year); }
    finally { setPdfLoading(false); }
  };

  if (authLoading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#07090f' }}>
      <div style={{ width:32, height:32, border:'3px solid #1f2937', borderTopColor:'#00d4a4', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
      <style suppressHydrationWarning>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  const stats = calcStats(reviews);

  return (
    <div className="app-shell">
      <Sidebar/>
      <main className="main-content">

        {/* ── Page header ── */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">{MONTH_NAMES[month-1]} {year} — Review Overview</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="add-btn">
            <span>＋</span> Add Entry
          </button>
        </div>

        {/* ── Stats cards ── */}
        <StatsCards stats={stats}/>

        {/* ── Table card ── */}
        <div className="table-card">
          {/* Toolbar */}
          <div className="table-toolbar">
            <div className="toolbar-left">
              <h3 className="table-title">Review Entries</h3>
              <p className="table-count">
                {filtered.length} of {reviews.length} {reviews.length === 1 ? 'record' : 'records'}
                {search && <span className="search-badge"> · filtered</span>}
              </p>
            </div>
            <div className="toolbar-right">
              <MonthYearPicker month={month} year={year} onChange={(m,y) => { setMonth(m); setYear(y); setSearch(''); }}/>
              <button
                onClick={handleDownload}
                disabled={pdfLoading || filtered.length === 0}
                className="dl-btn"
              >
                {pdfLoading
                  ? <span className="spin-sm"/>
                  : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:15,height:15}}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a1 1 0 001 1h10a1 1 0 001-1v-1M7 10l3 3m0 0l3-3m-3 3V4"/>
                    </svg>
                }
                <span className="dl-text">PDF</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="search-row">
            <div className="search-wrap">
              <svg className="search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="9" cy="9" r="5.5" strokeLinecap="round"/>
                <path strokeLinecap="round" d="M15 15l-2.5-2.5"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search intern, advisor, type…"
                className="search-input"
              />
              {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          </div>

          {/* Table */}
          <div className="table-body">
            {loading ? (
              <div className="table-loading">
                <span className="spin-ring"/> Loading entries…
              </div>
            ) : (
              <ReviewTable reviews={filtered} onDelete={handleDelete} onEdit={r => setEditReview(r)}/>
            )}
          </div>
        </div>
      </main>

      {showAddModal && <AddReviewModal onClose={() => setShowAdd(false)} onAdded={fetchReviews}/>}
      {editReview   && <EditReviewModal review={editReview} onClose={() => setEditReview(null)} onUpdated={fetchReviews}/>}

      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        .app-shell{display:flex;min-height:100vh;background:#07090f;font-family:'Instrument Sans',sans-serif;overflow-x:hidden;width:100%;}
        .main-content{flex:1;margin-left:240px;padding:2rem;min-height:100vh;min-width:0;overflow-x:hidden;}
        @media(max-width:768px){.main-content{margin-left:0;padding:1rem;padding-top:68px;}}
        .page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.5rem;gap:.75rem;flex-wrap:wrap;}
        .page-title{font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff;margin:0 0 .2rem;}
        @media(max-width:400px){.page-title{font-size:1.4rem;}}
        .page-sub{font-size:.83rem;color:#4b5563;margin:0;}
        .add-btn{display:flex;align-items:center;gap:.45rem;padding:.65rem 1.1rem;background:#00d4a4;border:none;border-radius:12px;font-family:'Syne',sans-serif;font-weight:700;font-size:.85rem;color:#07090f;cursor:pointer;transition:background .2s,transform .1s;white-space:nowrap;flex-shrink:0;}
        .add-btn:hover{background:#00efb8;}
        .add-btn:active{transform:scale(.97);}
        .table-card{margin-top:1.25rem;background:#0d1117;border:1px solid #1f2937;border-radius:18px;overflow:hidden;}
        .table-toolbar{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:1rem 1.25rem;border-bottom:1px solid #1f2937;flex-wrap:wrap;}
        .toolbar-left{min-width:0;}
        .table-title{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:700;color:#e5e7eb;margin:0 0 .1rem;}
        .table-count{font-size:.73rem;color:#374151;margin:0;}
        .search-badge{color:#00d4a4;}
        .toolbar-right{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;}
        .dl-btn{display:flex;align-items:center;gap:.4rem;padding:.55rem .85rem;background:#111827;border:1px solid #1f2937;border-radius:10px;font-family:'Instrument Sans',sans-serif;font-size:.82rem;font-weight:600;color:#9ca3af;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0;}
        .dl-btn:hover{border-color:#374151;color:#e5e7eb;}
        .dl-btn:disabled{opacity:.4;cursor:not-allowed;}
        .search-row{padding:.75rem 1.25rem;border-bottom:1px solid #1f2937;}
        .search-wrap{position:relative;display:flex;align-items:center;}
        .search-icon{position:absolute;left:12px;width:15px;height:15px;color:#374151;pointer-events:none;}
        .search-input{width:100%;background:#111827;border:1.5px solid #1f2937;border-radius:10px;padding:.65rem 2.2rem .65rem 2.5rem;font-size:.86rem;color:#e5e7eb;font-family:'Instrument Sans',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s;}
        .search-input::placeholder{color:#374151;}
        .search-input:focus{border-color:#00d4a4;box-shadow:0 0 0 3px rgba(0,212,164,.09);}
        .search-clear{position:absolute;right:10px;background:none;border:none;cursor:pointer;color:#4b5563;font-size:.75rem;padding:4px;line-height:1;transition:color .15s;}
        .search-clear:hover{color:#9ca3af;}
        .table-body{padding:1rem 1.25rem;}
        @media(max-width:640px){.table-body{padding:.75rem;}}
        .table-loading{display:flex;align-items:center;justify-content:center;gap:.75rem;padding:3rem;color:#4b5563;font-size:.88rem;}
        .spin-ring{display:inline-block;width:22px;height:22px;border:2px solid #1f2937;border-top-color:#00d4a4;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}
        .spin-sm{display:inline-block;width:13px;height:13px;border:2px solid rgba(156,163,175,.3);border-top-color:#9ca3af;border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
      `}</style>
    </div>
  );
}
