'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { getRoleHomePath } from '@/lib/auth';

/** Legacy route — redirects to role-based dashboard */
export default function LegacyDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    router.replace(getRoleHomePath(user.type));
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07090f] text-emerald-400">
      Redirecting…
    </div>
  );
}
