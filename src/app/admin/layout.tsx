'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Leaf, ChevronLeft } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { EnerNovaLogo } from '@/components/Logo';
import { Sidebar } from '@/components/sidebar';
import { MobileHeader } from '@/components/mobile-header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/journals', icon: FileText, label: 'Kelola Jurnal' },
    { href: '/admin/users', icon: Users, label: 'Pengguna' },
    { href: '/admin/settings', icon: Settings, label: 'Pengaturan' }
  ];

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
<<<<<<< HEAD
        {/* Sidebar dengan state isOpen */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
          {/* Header Sidebar - Hidden di mobile karena ada MobileHeader */}
          <div className="hidden lg:block p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
=======
        {}
        <aside className="w-64 bg-white border-r border-emerald-100 shadow-lg flex flex-col">
          <div className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
>>>>>>> 0ebd92d359b7354a31f14c39e12f526d12107384
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-3 rounded-xl shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-emerald-900">EnerNova</h1>
                <span className="text-xs text-teal-600 font-medium">Admin Panel</span>
              </div>
            </div>
          </div>
          
          {}
          <div className="p-4 border-b border-emerald-100 bg-emerald-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@enernova.id'}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)} // Tutup sidebar saat link diklik (mobile)
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30' 
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-emerald-100 space-y-2">
            <Link 
              href="/"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg transition-colors font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Ke Chat
            </Link>
            <Button
              onClick={() => {
                setIsSidebarOpen(false);
                logout();
              }}
              variant="ghost"
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </Sidebar>

<<<<<<< HEAD
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header dengan Hamburger */}
          <MobileHeader 
            onMenuClick={() => setIsSidebarOpen(true)}
            title="EnerNova Admin"
            subtitle="Admin Panel"
          />

          {/* Content dengan padding yang pas */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
=======
        {}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
>>>>>>> 0ebd92d359b7354a31f14c39e12f526d12107384
      </div>
    </ProtectedRoute>
  );
}
