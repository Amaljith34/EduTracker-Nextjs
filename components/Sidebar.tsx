'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';

const NAV = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="nav-icon">
        <rect x="2" y="2" width="7" height="7" rx="1.5" strokeLinecap="round"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" strokeLinecap="round"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" strokeLinecap="round"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className="nav-icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 14l4-5 4 3 4-6 4 4"/>
        <path strokeLinecap="round" d="M2 18h16"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  const name = user?.user_metadata?.full_name ?? user?.email ?? 'Reviewer';
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <header className="mobile-bar">
        <div className="mobile-brand">
          <span className="brand-icon-sm">RT</span>
          <span className="brand-name">Review Tracker</span>
        </div>
        <button className="hamburger" onClick={() => setOpen(v => !v)}>
          <span/><span/><span/>
        </button>
      </header>

      {/* Overlay */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)}/>}

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-icon">RT</span>
            <div>
              <div className="brand-name-full">Review Tracker</div>
              {/* <div className="brand-tagline"></div> */}
            </div>
          </div>

          <nav className="sidebar-nav">
            <p className="nav-section-label">Menu</p>
            {NAV.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href} className={`nav-item ${active ? 'nav-active' : ''}`} onClick={() => setOpen(false)}>
                  {item.icon}
                  <span>{item.label}</span>
                  {active && <span className="nav-pip"/>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-row">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <p className="user-name">{name}</p>
              <p className="user-role">SDE Reviewer</p>
            </div>
          </div>
          <button className="signout-btn" onClick={handleSignOut}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" style={{width:16,height:16}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10H3m0 0l3-3m-3 3l3 3M10 3h5a2 2 0 012 2v10a2 2 0 01-2 2h-5"/>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@400;500;600&display=swap');
        .sidebar{position:fixed;top:0;left:0;height:100vh;width:240px;background:#07090f;border-right:1px solid #111827;display:flex;flex-direction:column;z-index:100;transition:transform .25s cubic-bezier(.4,0,.2,1);}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%);}
          .sidebar.sidebar-open{transform:translateX(0);}
        }
        .sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99;backdrop-filter:blur(2px);}
        .mobile-bar{display:none;position:fixed;top:0;left:0;right:0;height:56px;background:#07090f;border-bottom:1px solid #111827;align-items:center;justify-content:space-between;padding:0 1.25rem;z-index:98;}
        @media(max-width:768px){.mobile-bar{display:flex;}}
        .mobile-brand{display:flex;align-items:center;gap:.6rem;}
        .brand-icon-sm{width:30px;height:30px;background:#00d4a4;border-radius:7px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:11px;color:#07090f;}
        .brand-name{font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;color:#fff;}
        .hamburger{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;gap:5px;padding:4px;}
        .hamburger span{display:block;width:22px;height:2px;background:#6b7280;border-radius:2px;}

        .sidebar-top{flex:1;overflow-y:auto;padding:1.5rem 1rem 1rem;}
        .sidebar-brand{display:flex;align-items:center;gap:.75rem;margin-bottom:2rem;padding:0 .5rem;}
        .brand-icon{width:36px;height:36px;background:#00d4a4;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:12px;color:#07090f;flex-shrink:0;}
        .brand-name-full{font-family:'Syne',sans-serif;font-weight:700;font-size:.85rem;color:#fff;line-height:1.2;}
        .brand-tagline{font-size:.7rem;color:#374151;}

        .sidebar-nav{display:flex;flex-direction:column;gap:2px;}
        .nav-section-label{font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#374151;padding:.25rem .5rem .5rem;margin:0;}
        .nav-item{display:flex;align-items:center;gap:.75rem;padding:.65rem .75rem;border-radius:10px;font-family:'Instrument Sans',sans-serif;font-size:.88rem;font-weight:500;color:#6b7280;text-decoration:none;transition:all .15s;position:relative;}
        .nav-item:hover{background:#111827;color:#d1d5db;}
        .nav-active{background:#0d1f1a !important;color:#00d4a4 !important;}
        .nav-icon{width:18px;height:18px;flex-shrink:0;}
        .nav-pip{position:absolute;right:10px;width:5px;height:5px;border-radius:50%;background:#00d4a4;}

        .sidebar-footer{padding:1rem;border-top:1px solid #111827;display:flex;flex-direction:column;gap:.75rem;}
        .user-row{display:flex;align-items:center;gap:.75rem;padding:.25rem .25rem 0;}
        .user-avatar{width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,#1e3a5f,#1a2a3a);border:1px solid #1e3a5f;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:700;font-size:.7rem;color:#60a5fa;flex-shrink:0;}
        .user-info{overflow:hidden;}
        .user-name{font-size:.82rem;font-weight:600;color:#d1d5db;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;}
        .user-role{font-size:.7rem;color:#374151;margin:0;}
        .signout-btn{display:flex;align-items:center;gap:.6rem;width:100%;padding:.6rem .75rem;background:none;border:1px solid #111827;border-radius:10px;font-family:'Instrument Sans',sans-serif;font-size:.82rem;font-weight:500;color:#6b7280;cursor:pointer;transition:all .15s;}
        .signout-btn:hover{border-color:#1f2937;color:#ef4444;background:#1a0808;}
      `}</style>
    </>
  );
}
