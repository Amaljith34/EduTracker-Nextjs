'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { UserRole } from '@/types';

interface NavItem {
  href: string;
  label: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  nav: NavItem[];
  title: string;
}

const navIcons: Record<string, string> = {
  Dashboard: '📊',
  Subscribers: '👥',
  Users: '🎓',
  Subjects: '📚',
  Reviews: '📝',
  Transactions: '💳',
  Profile: '👤',
  Analytics: '📈',
};

export function DashboardLayout({ children, nav, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-[#07090f] text-slate-100">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl md:flex">
        <div className="border-b border-slate-800/80 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-lg font-black text-slate-950">
              E
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">EduTracker</p>
              <h1 className="text-sm font-semibold text-white">{title}</h1>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {nav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 shadow-inner shadow-emerald-500/5'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className="text-base opacity-80">{navIcons[item.label] || '•'}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/80 p-4">
          <div className="rounded-xl bg-slate-900/60 p-3">
            <p className="truncate text-sm font-medium text-white">{user?.fullName}</p>
            <p className="text-xs text-slate-500">{user?.type as UserRole}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-[#07090f]/90 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-white">{title}</p>
            <Link href={nav[nav.length - 1]?.href || '/'} className="text-xs text-emerald-400">
              Menu
            </Link>
          </div>
          <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
            {nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>
        <div className="page-gradient min-h-full p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
