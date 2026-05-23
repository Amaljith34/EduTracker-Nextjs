'use client';
import { ReviewStats } from '@/types';

interface Props { stats: ReviewStats; }

const cards = [
  { key: 'total_review'        as keyof ReviewStats, label: 'Total Reviews',   icon: '📋', from: '#4f46e5', to: '#3730a3' },
  { key: 'total_session'       as keyof ReviewStats, label: 'Single Sessions', icon: '👤', from: '#059669', to: '#065f46' },
  { key: 'total_group_session' as keyof ReviewStats, label: 'Group Sessions',  icon: '👥', from: '#d97706', to: '#92400e' },
  { key: 'total_group_project' as keyof ReviewStats, label: 'Group Projects',  icon: '🗂️', from: '#dc2626', to: '#991b1b' },
];

export default function StatsCards({ stats }: Props) {
  return (
    <>
      <div className="stats-grid">
        {cards.map((c) => (
          <div key={c.key} className="stat-card" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
            <div className="stat-blob"/>
            <div className="stat-inner">
              <span className="stat-icon">{c.icon}</span>
              <p className="stat-value">{stats[c.key]}</p>
              <p className="stat-label">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
      <style suppressHydrationWarning>{`
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
        @media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:400px){.stats-grid{grid-template-columns:repeat(2,1fr);gap:.6rem;}}
        .stat-card{position:relative;overflow:hidden;border-radius:16px;padding:1.25rem;box-shadow:0 4px 16px rgba(0,0,0,.3);}
        @media(max-width:400px){.stat-card{padding:.9rem;border-radius:12px;}}
        .stat-blob{pointer-events:none;position:absolute;right:-12px;top:-12px;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,.08);filter:blur(12px);}
        .stat-inner{position:relative;}
        .stat-icon{font-size:1.4rem;}
        @media(max-width:400px){.stat-icon{font-size:1.1rem;}}
        .stat-value{margin:.5rem 0 .2rem;font-size:2.2rem;font-weight:900;color:#fff;line-height:1;letter-spacing:-1px;}
        @media(max-width:900px){.stat-value{font-size:1.8rem;}}
        @media(max-width:400px){.stat-value{font-size:1.5rem;}}
        .stat-label{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.65);margin:0;}
        @media(max-width:400px){.stat-label{font-size:.6rem;}}
      `}</style>
    </>
  );
}