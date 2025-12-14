'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { EnerNovaLoading } from '@/components/Logo';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (requireAdmin && user.role.toLowerCase() !== 'admin') {
        router.push('/');
      }
    }
  }, [user, isLoading, requireAdmin, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="flex items-center gap-4 rounded-2xl bg-white/50 p-8 shadow-2xl backdrop-blur-lg border border-emerald-200">
          <EnerNovaLoading size={60} />
          <div className="text-left">
            <h2 className="text-xl font-bold text-emerald-700">Mempersiapkan Sesi...</h2>
            <p className="text-slate-600">Mengecek kredensial & memuat data.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || (requireAdmin && user.role.toLowerCase() !== 'admin')) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="flex items-center gap-4 rounded-2xl bg-white/50 p-8 shadow-2xl backdrop-blur-lg border border-emerald-200">
          <EnerNovaLoading size={60} />
          <div className="text-left">
            <h2 className="text-xl font-bold text-emerald-700">Mengalihkan...</h2>
            <p className="text-slate-600">Anda akan dialihkan ke halaman yang sesuai.</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
