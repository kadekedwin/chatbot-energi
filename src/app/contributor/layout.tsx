'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, LogOut, Leaf, ChevronLeft, Award, TrendingUp } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { EnerNovaLogo } from '@/components/Logo';

export default function ContributorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { href: '/contributor', icon: TrendingUp, label: 'Dashboard' },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {}
        <aside className="w-64 bg-white border-r border-emerald-100 shadow-lg flex flex-col">
          <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-3">
              <div className="shadow-lg rounded-xl">
                <EnerNovaLogo size={40} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-emerald-900">EnerNova</h1>
                <span className="text-xs text-teal-600 font-medium">Contributor Portal</span>
              </div>
            </div>
          </div>
          
          {}
          <div className="p-4 border-b border-emerald-100 bg-gradient-to-r from-amber-50 to-yellow-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Kontributor'}</p>
                <p className="text-xs text-amber-600 font-medium truncate">Kontributor</p>
              </div>
            </div>
          </div>
          
          {}
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Chat
              </Button>
            </Link>
            
            <div className="pt-4 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start gap-3 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
          
          {}
          <div className="p-4 border-t border-emerald-100">
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </Button>
          </div>
        </aside>

        {}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
