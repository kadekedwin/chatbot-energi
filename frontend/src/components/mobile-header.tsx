'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white md:hidden">
      {/* Logo Kecil untuk Mobile */}
      <div className="flex items-center gap-2 font-bold text-slate-800">
        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
          E
        </div>
        <span>EnerNova</span>
      </div>

      {/* Tombol "Gagang Pintu" (Menu Hamburger) */}
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6 text-slate-600" />
      </Button>
    </div>
  );
}