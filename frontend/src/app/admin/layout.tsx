// FILE: src/app/admin/layout.tsx
'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
// PERBAIKAN: Import langsung dari components (sesuai struktur folder Anda)
import ProtectedRoute from '@/components/ProtectedRoute'; 
import { MobileHeader } from '@/components/mobile-header'; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}