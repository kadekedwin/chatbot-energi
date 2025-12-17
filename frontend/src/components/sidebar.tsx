'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, Users, Settings, X, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: BookOpen, label: 'Kelola Jurnal', href: '/admin/journals' },
    { icon: Users, label: 'Pengguna', href: '/admin/users' },
    { icon: Settings, label: 'Pengaturan', href: '/admin/settings' },
  ];

  return (
    <>
      {/* Overlay Gelap (Hanya muncul di Mobile saat sidebar terbuka) */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar Utama */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 md:translate-x-0 md:static",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="font-bold text-xl text-emerald-900">EnerNova</span>
          </div>
          {/* Tombol Close (Hanya di Mobile) */}
          <button onClick={onClose} className="md:hidden text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // Tutup sidebar saat menu diklik (di mobile)
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-emerald-50 text-emerald-600" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
             <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 cursor-pointer hover:bg-red-50 rounded-lg">
                <LogOut size={20} />
                <span>Keluar</span>
             </div>
        </div>
      </aside>
    </>
  );
}