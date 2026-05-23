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

export function DashboardLayout({ children, nav, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-800 bg-slate-900 p-4 md:flex">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-emerald-400">EduTracker</p>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-slate-800 pt-4">
          <p className="text-sm font-medium">{user?.fullName}</p>
          <p className="text-xs text-slate-500">{user?.type as UserRole}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur md:hidden">
          <p className="font-semibold">{title}</p>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
