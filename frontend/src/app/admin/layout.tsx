'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MobileHeader } from '@/components/mobile-header'; // Import komponen baru tadi
import ProtectedRoute from '@/components/ProtectedRoute'; // Pastikan path ini sesuai dengan file Anda

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ini adalah "State" (Ingatan) untuk status Buka/Tutup
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex h-screen bg-gray-50">
        
        {/* 1. SIDEBAR (Pintu) */}
        {/* Dia menerima perintah isOpen dari sini */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* 2. KONTEN UTAMA */}
        <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
          
          {/* 3. HEADER MOBILE (Gagang Pintu) */}
          {/* Hanya muncul di HP. Saat diklik, dia mengubah status jadi TRUE (Buka) */}
          <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Area Konten (Dashboard, Tabel, dll) */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-6">
            {children}
          </main>
        </div>
        
      </div>
    </ProtectedRoute>
  );
}