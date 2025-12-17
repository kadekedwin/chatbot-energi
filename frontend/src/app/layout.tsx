'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute'; // Pastikan path import ini benar (tanpa /auth)
import { MobileHeader } from '@/components/mobile-header'; // Opsional, hapus jika belum punya

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Sidebar Desktop & Mobile */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Mobile (Hanya muncul di HP) */}
          <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Konten Utama Admin */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 md:p-6 transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}