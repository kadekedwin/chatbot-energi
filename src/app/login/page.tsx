'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Leaf, Lock, Mail, Eye, EyeOff, Zap, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { EnerNovaLogo } from '@/components/Logo';

interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Email dan password harus diisi');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting login with AuthContext...', { email: credentials.email });

      const result = await authLogin(credentials.email, credentials.password);
      
      if (result.success) {
        console.log('✅ Login successful! Getting user data from localStorage...');

        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const role = user.role.toUpperCase();
          
          console.log('🔄 Redirecting based on role:', role);

          if (role === 'ADMIN') {
            console.log('→ Redirecting to /admin/dashboard');
            router.push('/admin/dashboard');
          } else if (role === 'CONTRIBUTOR') {
            console.log('→ Redirecting to /contributor');
            router.push('/contributor');
          } else {
            console.log('→ Redirecting to /');
            router.push('/');
          }
        } else {
          console.error('❌ User data not found in localStorage');
          setError('Terjadi kesalahan saat menyimpan data user');
          setIsLoading(false);
        }
      } else {
        console.error('❌ Login failed:', result.error);
        setError(result.error || 'Login gagal. Periksa kredensial Anda.');
        setIsLoading(false);
      }

    } catch (error: any) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Terjadi kesalahan saat login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_60%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {}
        <div className="hidden lg:block space-y-8 p-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-4 rounded-2xl shadow-2xl shadow-emerald-600/40">
              <Leaf className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                EnerNova
              </h1>
              <p className="text-slate-600 text-lg font-medium mt-1">Inovasi Cerdas untuk Energi Masa Depan</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 hover:shadow-xl transition-all">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Leaf className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">Eco-Friendly Research</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Platform AI berbasis riset akademis untuk mendukung transisi energi hijau Indonesia
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-lg border border-teal-100 hover:shadow-xl transition-all">
              <div className="bg-teal-100 p-3 rounded-xl">
                <Sparkles className="w-7 h-7 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">AI-Powered Insights</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Analisis cerdas menggunakan machine learning untuk optimasi riset energi terbarukan
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 hover:shadow-xl transition-all">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Shield className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">Verified Academic Data</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Database terintegrasi dengan 51+ jurnal internasional tervalidasi oleh expert panel
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl shadow-lg border border-emerald-200 hover:shadow-xl transition-all">
              <div className="bg-white p-3 rounded-xl shadow-md">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 mb-2 text-lg">Sustainable Growth</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Mendorong pertumbuhan ekonomi hijau melalui data-driven decision making
                </p>
              </div>
            </div>
          </div>
        </div>

        {}
        <Card className="shadow-2xl border-2 border-emerald-100 overflow-hidden bg-white">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
          
          <CardHeader className="space-y-3 pt-8 pb-6">
            <div className="flex justify-center lg:hidden mb-4">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-2xl shadow-lg shadow-emerald-600/40">
                <Leaf className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center text-slate-900">
              Selamat Datang
            </CardTitle>
            <CardDescription className="text-center text-slate-600 text-base">
              Masuk untuk mengakses platform riset energi terbarukan
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              
              {}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400"
                  disabled={isLoading}
                  required
                />
              </div>

              {}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {error}
                </div>
              )}

<<<<<<< HEAD
              {/* Submit Button */}
=======
              {}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  🚀 Demo Access - 3 Role Tersedia:
                </p>
                <div className="space-y-2">
                  {}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span className="font-mono text-xs font-semibold text-purple-700">👑 ADMIN</span>
                      </div>
                      <Button 
                        type="button"
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDemoLogin('admin')}
                        className="h-7 px-3 text-xs bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                        disabled={isLoading}
                      >
                        Login
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-600 font-mono pl-6">admin@enernova.id</p>
                    <p className="text-[9px] text-slate-500 pl-6 mt-1">Full access: Dashboard, Approve/Reject, Manage Users</p>
                  </div>
                  
                  {}
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                        <span className="font-mono text-xs font-semibold text-amber-700">📤 KONTRIBUTOR</span>
                      </div>
                      <Button 
                        type="button"
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDemoLogin('contributor')}
                        className="h-7 px-3 text-xs bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
                        disabled={isLoading}
                      >
                        Login
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-600 font-mono pl-6">kontributor@enernova.id</p>
                    <p className="text-[9px] text-slate-500 pl-6 mt-1">Upload jurnal (multiple), Track status approval</p>
                  </div>
                  
                  {}
                  <div className="bg-white rounded-lg p-3 border border-emerald-200">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono text-xs font-semibold text-emerald-700">👤 USER</span>
                      </div>
                      <Button 
                        type="button"
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDemoLogin('user')}
                        className="h-7 px-3 text-xs bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                        disabled={isLoading}
                      >
                        Login
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-600 font-mono pl-6">peneliti@enernova.id</p>
                    <p className="text-[9px] text-slate-500 pl-6 mt-1">Chat AI, View charts, Access research database</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 text-center mt-2 pt-2 border-t">
                  🔑 Password semua role: <span className="font-mono font-bold">admin123, kontributor123, peneliti123</span>
                </p>
              </div>

              {}
>>>>>>> 0ebd92d359b7354a31f14c39e12f526d12107384
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-600/40 hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Masuk ke Platform</span>
                  </div>
                )}
              </Button>

              {/* Register Link */}
              <div className="pt-2 text-center border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Belum punya akun?{' '}
                  <Link 
                    href="/register"
                    className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                  >
                    Daftar Sekarang
                  </Link>
                </p>
              </div>

            </CardContent>
          </form>

          <CardFooter className="flex-col space-y-3 border-t bg-slate-50 py-4">
            <button 
              type="button"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors"
            >
              Lupa password?
            </button>
            
            <div className="text-xs text-slate-500 text-center pt-2">
              <p className="flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                Keamanan data Anda terjamin dengan enkripsi end-to-end
              </p>
            </div>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
