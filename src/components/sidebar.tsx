'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ isOpen, onClose, children, className }: SidebarProps) {
  return (
    <>
      {/* Backdrop Overlay - hanya muncul di mobile saat sidebar terbuka */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          // Base styles
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-emerald-100 shadow-lg z-50 flex flex-col",
          // Mobile: slide in/out dari kiri
          "transform transition-transform duration-300 ease-in-out lg:transition-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: selalu terlihat, tidak perlu transform
          "lg:translate-x-0 lg:static lg:z-auto",
          className
        )}
      >
        {/* Close Button - hanya di mobile */}
        <div className="lg:hidden flex justify-end p-4 border-b border-emerald-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        {children}
      </aside>
    </>
  );
}
