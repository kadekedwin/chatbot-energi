'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Key, Bell, Palette, Database, Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'EnerNova',
    siteDescription: 'AI Research Platform untuk Energi Terbarukan',
    maxUploadSize: '10',
    apiKey: 'gsk_••••••••••••••••',
    emailNotifications: true,
    autoApprove: false
  });

  const handleSave = () => {
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: system-ui, -apple-system, sans-serif;
      animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <div>
        <div style="font-weight: 700; font-size: 1rem;">✅ Berhasil Disimpan!</div>
        <div style="font-size: 0.875rem; margin-top: 2px;">Semua pengaturan telah diperbarui</div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
            Pengaturan Sistem
          </h1>
          <p className="text-slate-600 mt-2">
            Konfigurasi dan pengaturan aplikasi EnerNova
          </p>
        </div>

        {}
        <Card className="shadow-xl border-2 border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <SettingsIcon className="w-5 h-5" />
              Pengaturan Umum
            </CardTitle>
            <CardDescription>
              Konfigurasi dasar aplikasi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Nama Aplikasi
              </label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="border-emerald-200"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Deskripsi
              </label>
              <Input
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                className="border-emerald-200"
              />
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="shadow-xl border-2 border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Key className="w-5 h-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Pengaturan koneksi AI dan API
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Groq API Key
              </label>
              <Input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                className="border-emerald-200"
                placeholder="gsk_your_api_key_here"
              />
              <p className="text-xs text-slate-500 mt-1">
                API key untuk koneksi ke Groq AI
              </p>
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="shadow-xl border-2 border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Database className="w-5 h-5" />
              Upload & Storage
            </CardTitle>
            <CardDescription>
              Pengaturan upload file dan penyimpanan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Max Upload Size (MB)
              </label>
              <Input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({...settings, maxUploadSize: e.target.value})}
                className="border-emerald-200"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Auto-Approve Journals</p>
                <p className="text-sm text-slate-600">Otomatis approve jurnal yang di-upload</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApprove}
                  onChange={(e) => setSettings({...settings, autoApprove: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="shadow-xl border-2 border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Bell className="w-5 h-5" />
              Notifikasi
            </CardTitle>
            <CardDescription>
              Pengaturan notifikasi email dan alert
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-600">Terima notifikasi via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan Pengaturan
          </Button>
        </div>

      </div>
    </div>
  );
}
