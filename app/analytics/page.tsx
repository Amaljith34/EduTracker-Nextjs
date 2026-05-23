'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Sidebar from '@/components/Sidebar';
import { fetchAnalytics, AnalyticsData } from '@/lib/analytics';
import { REVIEW_TYPE_LABELS, ReviewType } from '@/types';

const TYPE_COLORS: Record<ReviewType, string> = {
  review:        '#00d4a4',
  session:       '#6366f1',
  group_session: '#f59e0b',
  group_project: '#ef4444',
};

const RANGE_OPTIONS = [
  { label: '3M',  months: 3 },
  { label: '6M',  months: 6 },
  { label: '1Y',  months: 12 },
  { label: 'All', months: 999 },
];

function KpiCard({ label, value, sub, color }: { label:string; value:string|number; sub:string; color:string }) {
  return (
    <div className="kpi-card">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className="kpi-sub">{sub}</p>
      <div className="kpi-bar" style={{ background: color }}/>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="ct-label">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="ct-row">
          <span className="ct-dot" style={{ background: p.color }}/>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData]             = useState<AnalyticsData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [trendRange, setTrendRange] = useState(6);

  useEffect(() => {
    fetchAnalytics().then(d => { setData(d); setLoading(false); });
  }, []);

  const filteredTrend = data?.monthlyTrend.slice(-trendRange) ?? [];

  return (
    <div className="app-shell">
      <Sidebar/>
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">All time insights</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spin-ring"/>
            <p>Building your analytics…</p>
          </div>
        ) : data ? (
          <div className="analytics-grid">

            {/* KPI row */}
            <div className="kpi-row">
              <KpiCard label="All-Time Total"   value={data.totalAllTime}   sub="reviews logged"          color="#00d4a4"/>
              <KpiCard label="This Month"        value={data.totalThisMonth} sub="reviews this month"      color="#6366f1"/>
              <KpiCard label="Today"             value={data.totalToday}     sub="reviews today"           color="#f59e0b"/>
              <KpiCard label="Most In One Day"   value={data.mostInADay}     sub={data.mostInADayDate || '—'} color="#ef4444"/>
            </div>

            {/* Monthly trend */}
            <div className="chart-card full-width">
              <div className="chart-card-header">
                <h3 className="chart-title">Monthly Trend</h3>
                <div className="range-btns">
                  {RANGE_OPTIONS.map(o => (
                    <button key={o.label} onClick={() => setTrendRange(o.months)}
                      className={`range-btn ${trendRange === o.months ? 'active' : ''}`}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={filteredTrend} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                  <defs>
                    {(['review','session','group_session','group_project'] as ReviewType[]).map(t => (
                      <linearGradient key={t} id={`grad-${t}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={TYPE_COLORS[t]} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={TYPE_COLORS[t]} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937"/>
                  <XAxis dataKey="month" tick={{ fill:'#4b5563', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:'#4b5563', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ fontSize:12, color:'#6b7280' }}/>
                  {(['review','session','group_session','group_project'] as ReviewType[]).map(t => (
                    <Area key={t} type="monotone" dataKey={t} name={REVIEW_TYPE_LABELS[t]}
                      stroke={TYPE_COLORS[t]} strokeWidth={2}
                      fill={`url(#grad-${t})`}/>
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Type distribution pie */}
            <div className="chart-card">
              <h3 className="chart-title">Type Distribution</h3>
              {data.typeDistribution.length === 0 ? (
                <p className="no-data">No data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data.typeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      dataKey="value" nameKey="name" paddingAngle={3}>
                      {data.typeDistribution.map((e, i) => <Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip formatter={(v: number, n: string) => [v, n]}
                      contentStyle={{ background:'#0d1117', border:'1px solid #1f2937', borderRadius:8, fontSize:12 }}/>
                    <Legend wrapperStyle={{ fontSize:12, color:'#6b7280' }}/>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top advisors */}
            <div className="chart-card">
              <h3 className="chart-title">Top Advisors</h3>
              {data.topAdvisors.length === 0 ? <p className="no-data">No data yet</p> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.topAdvisors} layout="vertical" margin={{ left:0, right:10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false}/>
                    <XAxis type="number" tick={{ fill:'#4b5563', fontSize:11 }} axisLine={false} tickLine={false} allowDecimals={false}/>
                    <YAxis type="category" dataKey="advisor_name" width={90}
                      tick={{ fill:'#9ca3af', fontSize:11 }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="total" name="Total" fill="#00d4a4" radius={[0,4,4,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top interns */}
            <div className="chart-card">
              <h3 className="chart-title">Top Interns</h3>
              {data.topInterns.length === 0 ? <p className="no-data">No data yet</p> : (
                <div className="intern-list">
                  {data.topInterns.map((intern, i) => (
                    <div key={i} className="intern-row">
                      <span className="intern-rank">#{i+1}</span>
                      <span className="intern-name">{intern.intern_name}</span>
                      <span className="intern-count">{intern.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="chart-card">
              <h3 className="chart-title">Recent Activity</h3>
              {data.recentActivity.length === 0 ? <p className="no-data">No data yet</p> : (
                <div className="activity-list">
                  {data.recentActivity.map((r, i) => (
                    <div key={i} className="activity-row">
                      <span className="activity-dot" style={{ background: TYPE_COLORS[r.type as ReviewType] }}/>
                      <div className="activity-info">
                        <span className="activity-name">{r.intern_name}</span>
                        <span className="activity-type">{REVIEW_TYPE_LABELS[r.type as ReviewType]}</span>
                      </div>
                      <span className="activity-date">{r.review_date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        ) : (
          <p style={{ color:'#4b5563', textAlign:'center', padding:'4rem' }}>Failed to load analytics.</p>
        )}
      </main>

      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;}
        .app-shell{display:flex;min-height:100vh;background:#07090f;font-family:'Instrument Sans',sans-serif;}
        .main-content{flex:1;margin-left:240px;padding:2rem;min-height:100vh;min-width:0;}
        @media(max-width:768px){.main-content{margin-left:0;padding:1rem;padding-top:68px;}}
        .page-header{margin-bottom:1.5rem;}
        .page-title{font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff;margin:0 0 .2rem;}
        .page-sub{font-size:.83rem;color:#4b5563;margin:0;}
        .loading-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:6rem;color:#4b5563;}
        .spin-ring{width:28px;height:28px;border:2px solid #1f2937;border-top-color:#00d4a4;border-radius:50%;animation:spin .7s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .analytics-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;}
        @media(max-width:900px){.analytics-grid{grid-template-columns:1fr;}}
        .full-width{grid-column:1/-1;}
        .kpi-row{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
        @media(max-width:700px){.kpi-row{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:400px){.kpi-row{grid-template-columns:1fr;}}
        .kpi-card{position:relative;background:#0d1117;border:1px solid #1f2937;border-radius:14px;padding:1.1rem 1.25rem 1.25rem;overflow:hidden;}
        .kpi-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#4b5563;margin:0 0 .4rem;}
        .kpi-value{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;margin:0 0 .2rem;line-height:1;}
        .kpi-sub{font-size:.75rem;color:#374151;margin:0;}
        .kpi-bar{position:absolute;bottom:0;left:0;right:0;height:3px;opacity:.7;}
        .chart-card{background:#0d1117;border:1px solid #1f2937;border-radius:14px;padding:1.25rem;}
        .chart-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem;}
        .chart-title{font-family:'Syne',sans-serif;font-size:.92rem;font-weight:700;color:#e5e7eb;margin:0 0 1rem;}
        .chart-card-header .chart-title{margin:0;}
        .range-btns{display:flex;gap:.35rem;}
        .range-btn{padding:.3rem .65rem;border-radius:7px;border:1px solid #1f2937;background:none;color:#6b7280;font-size:.75rem;font-weight:600;cursor:pointer;transition:all .15s;font-family:'Instrument Sans',sans-serif;}
        .range-btn:hover{border-color:#374151;color:#e5e7eb;}
        .range-btn.active{background:#00d4a4;border-color:#00d4a4;color:#07090f;}
        .no-data{color:#4b5563;font-size:.85rem;text-align:center;padding:2rem 0;margin:0;}
        .chart-tooltip{background:#0d1117;border:1px solid #1f2937;border-radius:8px;padding:.6rem .85rem;font-size:.8rem;}
        .ct-label{color:#9ca3af;margin:0 0 .35rem;font-weight:600;}
        .ct-row{display:flex;align-items:center;gap:.5rem;margin:.2rem 0;color:#e5e7eb;}
        .ct-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
        .intern-list{display:flex;flex-direction:column;gap:.5rem;}
        .intern-row{display:flex;align-items:center;gap:.75rem;padding:.6rem .75rem;background:#111827;border-radius:8px;}
        .intern-rank{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;color:#4b5563;width:20px;flex-shrink:0;}
        .intern-name{flex:1;font-size:.85rem;color:#e5e7eb;}
        .intern-count{font-family:'Syne',sans-serif;font-size:.85rem;font-weight:700;color:#00d4a4;}
        .activity-list{display:flex;flex-direction:column;gap:.5rem;}
        .activity-row{display:flex;align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid #111827;}
        .activity-row:last-child{border-bottom:none;}
        .activity-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
        .activity-info{flex:1;display:flex;flex-direction:column;gap:.1rem;}
        .activity-name{font-size:.85rem;color:#e5e7eb;}
        .activity-type{font-size:.73rem;color:#4b5563;}
        .activity-date{font-size:.75rem;color:#374151;white-space:nowrap;}
      `}</style>
    </div>
  );
}
