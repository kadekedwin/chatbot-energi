'use client';

import { useEffect, useState } from 'react';
import ChatInterface from '@/components/chat-interface';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, Clock } from 'lucide-react';
import { EnerNovaLogo } from '@/components/Logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function HomePage() {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      const dateString = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setCurrentTime(`${timeString} - ${dateString}`);
    };
    
    updateTime(); 
    const interval = setInterval(updateTime, 1000); 
    
    return () => clearInterval(interval); 
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {}
        <header className="bg-white border-b border-emerald-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="shadow-lg rounded-xl">
                  <EnerNovaLogo size={48} />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                    EnerNova AI
                  </h1>
                  <p className="text-xs text-slate-500">Eco-Futurist Research Assistant</p>
                </div>
              </div>
              
              {}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">{currentTime}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">{user?.name || 'User'}</span>
                  {user?.role?.toLowerCase() === 'admin' && (
                    <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-semibold">Admin</span>
                  )}
                  {user?.role?.toLowerCase() === 'contributor' && (
                    <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">Kontributor</span>
                  )}
                </div>
                
                {user?.role?.toLowerCase() === 'admin' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/admin/dashboard'}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50 font-medium"
                  >
                    📊 Admin Panel
                  </Button>
                )}
                
                {user?.role?.toLowerCase() === 'contributor' && (
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/contributor'}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 font-medium"
                  >
                    📤 Portal Kontributor
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout}
                  className="text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {}
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </ProtectedRoute>
  );
}