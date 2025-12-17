'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnerNovaLogo } from '@/components/Logo';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
}

export function MobileHeader({ onMenuClick, title = "EnerNova AI", subtitle = "Eco-Futurist Research Assistant" }: MobileHeaderProps) {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-emerald-100 shadow-sm">
      <div className="flex items-center gap-3 p-4">
        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-emerald-600 hover:bg-emerald-50"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Logo & Title */}
        <div className="flex items-center gap-2 flex-1">
          <EnerNovaLogo size={32} />
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-[10px] text-slate-500">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
