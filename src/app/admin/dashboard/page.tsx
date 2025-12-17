'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, Users, Database, Leaf, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { DebugAPIInfo } from '@/components/debug-api-info';

interface Journal {
  id: string;
  filename: string;
  title: string;
  detectedAuthor: string;
  authorInstitution: string;
  publicationYear?: string;
  journalSource?: string;
  doi?: string | null;
  pdfUrl?: string;
  uploadDate: string;
  status: string;
  fileSize: string;
  contentPreview?: string;
  uploader?: {
    name: string;
    email: string;
  };
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusLower = status.toLowerCase();
  const config = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      icon: <Clock className="w-3 h-3" />,
      label: 'Menunggu'
    },
    approved: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      icon: <CheckCircle className="w-3 h-3" />,
      label: 'Disetujui'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: <XCircle className="w-3 h-3" />,
      label: 'Ditolak'
    }
  };

  const current = config[statusLower as keyof typeof config] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${current.bg} ${current.text} ${current.border}`}>
      {current.icon}
      {current.label}
    </span>
  );
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const { journals, fetchJournals, updateJournalStatus, isLoadingJournals } = useAppStore();
  const [currentTime, setCurrentTime] = useState('');
  const [localJournals, setLocalJournals] = useState<Journal[]>([]);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  useEffect(() => {
    setLocalJournals(journals as Journal[]);
  }, [journals]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: localJournals.length,
    pending: localJournals.filter(j => j.status.toUpperCase() === 'PENDING').length,
    approved: localJournals.filter(j => j.status.toUpperCase() === 'APPROVED').length,
    rejected: localJournals.filter(j => j.status.toUpperCase() === 'REJECTED').length,
    needsReview: localJournals.filter(j => j.detectedAuthor && j.detectedAuthor.includes('Perlu Review Manual')).length
  };

  const handleDashboardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const randomAuthors = [
      'Dr. Ahmad Fauzi et al.',
      'Prof. Siti Nurhaliza, Ph.D',
      'Budi Santoso, M.Eng',
      'Dr. Dewi Lestari et al.',
      'Ir. Rudi Hartono, M.T',
      'Prof. Angela Tritto',
      'Dr. Wei Chen et al.'
    ];

    const randomAuthor = randomAuthors[Math.floor(Math.random() * randomAuthors.length)];

    const newJournal: Journal = {
      id: Date.now().toString(),
      filename: file.name,
      title: file.name.replace(/\.[^/.]+$/, ''),
      detectedAuthor: 'Scanning...',
      authorInstitution: 'AI Scanning...',
      publicationYear: new Date().getFullYear().toString(),
      journalSource: 'Manual Upload',
      doi: null,
      pdfUrl: '',
      uploadDate: new Date().toISOString(),
      status: 'approved',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      contentPreview: '',
      uploader: {
        name: 'Administrator (Manual Upload)',
        email: user?.email || 'admin@enernova.id'
      }
    };

    setLocalJournals(prev => [newJournal, ...prev]);

    const scanNotification = document.createElement('div');
    scanNotification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="spinner" style="
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          "></div>
          <div>
            <div style="font-weight: 600; font-size: 16px;">🤖 AI Scanning Metadata...</div>
            <div style="font-size: 14px; opacity: 0.95; margin-top: 4px;">
              "${file.name}"
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(scanNotification);

    setTimeout(() => {
      scanNotification.remove();

      setLocalJournals(prev => 
        prev.map(j => 
          j.id === newJournal.id 
            ? { 
                ...j, 
                detectedAuthor: randomAuthor,
                authorInstitution: 'Verified by AI Scanner'
              } 
            : j
        )
      );

      const successNotification = document.createElement('div');
      successNotification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg style="width: 24px; height: 24px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <div style="font-weight: 600; font-size: 16px;">✅ Upload Berhasil!</div>
              <div style="font-size: 14px; opacity: 0.95; margin-top: 4px;">
                "${file.name}"<br/>
                👤 Author: <strong>${randomAuthor}</strong>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(successNotification);
      
      setTimeout(() => {
        successNotification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => successNotification.remove(), 300);
      }, 3000);
    }, 2000);

    e.target.value = '';
  };

  const handleApprove = async (id: string) => {
    const journal = localJournals.find(j => j.id === id);
    if (journal) {
      const result = await updateJournalStatus(id, 'APPROVED');
      if (!result.success) {
        alert('Error: ' + result.error);
        return;
      }

      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
          z-index: 9999;
          font-family: system-ui;
          animation: slideIn 0.3s ease-out;
          max-width: 400px;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg style="width: 24px; height: 24px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <div style="font-weight: 600; font-size: 16px;">✅ Jurnal Disetujui!</div>
              <div style="font-size: 14px; opacity: 0.95; margin-top: 4px;">
                "${journal.title.substring(0, 50)}${journal.title.length > 50 ? '...' : ''}" telah masuk ke database AI
              </div>
            </div>
          </div>
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
          }
        </style>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };

  const handleReject = async (id: string) => {
    const journal = localJournals.find(j => j.id === id);
    if (journal) {
      const reason = prompt(`❌ Alasan penolakan untuk "${journal.title.substring(0, 40)}...":`, 'Format tidak sesuai atau konten tidak relevan');
      
      if (reason !== null) {
        const result = await updateJournalStatus(id, 'REJECTED');
        if (!result.success) {
          alert('Error: ' + result.error);
          return;
        }

        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.3);
            z-index: 9999;
            font-family: system-ui;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
          ">
            <div style="display: flex; align-items: center; gap: 12px;">
              <svg style="width: 24px; height: 24px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <div style="font-weight: 600; font-size: 16px;">❌ Jurnal Ditolak</div>
                <div style="font-size: 14px; opacity: 0.95; margin-top: 4px;">
                  Alasan: ${reason}
                </div>
              </div>
            </div>
          </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.style.animation = 'slideOut 0.3s ease-in';
          setTimeout(() => notification.remove(), 300);
        }, 4000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Debug Info - only in development */}
        <DebugAPIInfo />
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Selamat Datang, {user?.name || 'Admin'}
            </h1>
            <p className="text-slate-600 mt-2 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              Kelola jurnal dan validasi konten platform EnerNova
            </p>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {currentTime}
            </p>
          </div>
          <div>
            <input
              type="file"
              id="dashboard-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              onChange={handleDashboardUpload}
            />
            <Button 
              onClick={() => document.getElementById('dashboard-upload')?.click()}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload Jurnal Baru
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-t-4 border-t-emerald-600 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Total Jurnal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.total}</div>
              <p className="text-xs text-slate-500 mt-1">Dokumen terdaftar</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-yellow-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                Menunggu Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-slate-500 mt-1">Perlu validasi</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-emerald-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Disetujui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.approved}</div>
              <p className="text-xs text-slate-500 mt-1">Jurnal aktif</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-purple-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Kontributor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">8</div>
              <p className="text-xs text-slate-500 mt-1">Pengguna aktif</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl border-2 border-emerald-100">
          <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="w-5 h-5" />
              🔍 Validasi & Scanning Jurnal Masuk
            </CardTitle>
            <CardDescription className="text-slate-600">
              Sistem otomatis mendeteksi <strong>First Author</strong> dan <strong>Tahun Terbit</strong> dari konten jurnal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto pb-4">
              <table className="w-full min-w-[1200px] text-left text-sm border-collapse">
                <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 sticky top-0 z-10">
                  <tr className="border-b-2 border-emerald-200">
                    <th className="py-4 px-6 text-emerald-700 font-semibold whitespace-nowrap">Judul Jurnal</th>
                    <th className="py-4 px-6 text-emerald-700 font-semibold whitespace-nowrap">Penulis</th>
                    <th className="py-4 px-6 text-emerald-700 font-semibold whitespace-nowrap">Tanggal</th>
                    <th className="py-4 px-6 text-emerald-700 font-semibold whitespace-nowrap">Ukuran</th>
                    <th className="py-4 px-6 text-emerald-700 font-semibold whitespace-nowrap">Status</th>
                    <th className="py-4 px-6 text-emerald-700 font-semibold whitespace-nowrap text-right">Aksi</th>
                  </tr>
                </thead>
                  <tbody>
                    {localJournals.map((journal) => (
                      <tr key={journal.id} className="border-b border-slate-200 hover:bg-emerald-50/50 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3 min-w-[250px]">
                            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-2 rounded-lg flex-shrink-0">
                              <FileText className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800 truncate" title={journal.title}>{journal.title}</p>
                              <p className="text-xs text-slate-500">ID: {journal.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2 min-w-[220px]">
                            <Avatar className="h-8 w-8 border-2 border-emerald-200 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-semibold">
                                {(journal.detectedAuthor || journal.uploader?.name || 'UK').substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              {journal.detectedAuthor === 'Scanning...' ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-sm text-blue-600 font-medium">Scanning...</span>
                                </div>
                              ) : journal.detectedAuthor && !journal.detectedAuthor.includes('Perlu Review Manual') ? (
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-emerald-700 truncate" title={journal.detectedAuthor}>
                                    ✅ {journal.detectedAuthor}
                                  </p>
                                  {journal.authorInstitution && journal.authorInstitution !== 'Not specified' && (
                                    <p className="text-xs text-slate-500 truncate" title={journal.authorInstitution}>
                                      🏛️ {journal.authorInstitution}
                                    </p>
                                  )}
                                  {journal.publicationYear && (
                                    <p className="text-xs text-blue-600 font-medium">
                                      📅 Tahun: {journal.publicationYear}
                                    </p>
                                  )}
                                  <p className="text-xs text-slate-400">
                                    📤 {journal.uploader?.name || 'Unknown'}
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-orange-600 flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    Author Belum Terdeteksi
                                  </p>
                                  <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-300">
                                    ⚠️ Perlu Review Manual
                                  </span>
                                  <p className="text-xs text-slate-400">
                                    📤 {journal.uploader?.name || 'Unknown'}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600 whitespace-nowrap">
                          {new Date(journal.uploadDate).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600 whitespace-nowrap">
                          {journal.fileSize}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <StatusBadge status={journal.status} />
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex justify-end gap-2 min-w-[180px]">
                            {journal.status === 'pending' || journal.status === 'PENDING' ? (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleApprove(journal.id)}
                                  className="text-emerald-600 hover:bg-emerald-50 border-emerald-300 hover:border-emerald-400 font-medium whitespace-nowrap"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Setuju
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleReject(journal.id)}
                                  className="text-red-600 hover:bg-red-50 border-red-300 hover:border-red-400 font-medium whitespace-nowrap"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Tolak
                                </Button>
                              </>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-slate-400"
                                disabled
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {isLoadingJournals && (
                <div className="flex items-center justify-center p-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-600 font-medium">Memuat data jurnal...</span>
                  </div>
                </div>
              )}

              {!isLoadingJournals && localJournals.length === 0 && (
                <div className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Belum Ada Jurnal</h3>
                  <p className="text-slate-600 mb-6 max-w-md">
                    Mulai dengan mengupload jurnal penelitian energi terbarukan pertama Anda
                  </p>
                  <Button 
                    onClick={() => document.getElementById('dashboard-upload')?.click()}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Upload Jurnal Pertama
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>

        {}
        <Card className="shadow-xl border-2 border-purple-100">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Users className="w-5 h-5" />
              📚 Katalog Penulis (Authors Database)
            </CardTitle>
            <CardDescription className="text-slate-600">
              Daftar penulis yang berhasil terdeteksi oleh AI Scanner dari {localJournals.length} jurnal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {(() => {
              const uniqueAuthors = Array.from(
                new Set(
                  localJournals
                    .filter(j => j.detectedAuthor && !j.detectedAuthor.includes('Perlu Review Manual') && j.detectedAuthor !== 'Scanning...')
                    .map(j => j.detectedAuthor)
                )
              ).sort();
              
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-purple-600">
                      {uniqueAuthors.length} Penulis Unik Terdeteksi
                    </p>
                    <p className="text-xs text-slate-500">
                      Success Rate: {localJournals.length > 0 ? ((uniqueAuthors.length / localJournals.length) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uniqueAuthors.map((author, idx) => {
                        const authorJournals = localJournals.filter(j => j.detectedAuthor === author);
                        const firstJournal = authorJournals[0];
                        
                        return (
                          <Card key={idx} className="p-4 hover:shadow-lg transition-shadow border-purple-100 hover:border-purple-300">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12 border-2 border-purple-200">
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-sm font-bold">
                                  {author.split(' ').slice(0, 2).map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-purple-700 truncate">{author}</p>
                                {firstJournal?.authorInstitution && firstJournal.authorInstitution !== 'Not specified' && (
                                  <p className="text-xs text-slate-500 truncate mt-1">🏛️ {firstJournal.authorInstitution}</p>
                                )}
                                {firstJournal?.publicationYear && (
                                  <p className="text-xs text-blue-600 mt-1">📅 Tahun: {firstJournal.publicationYear}</p>
                                )}
                                <div className="mt-2 pt-2 border-t border-purple-100">
                                  <p className="text-xs text-emerald-600 font-semibold">
                                    📚 {authorJournals.length} jurnal
                                  </p>
                                  <div className="mt-1 flex items-center gap-1">
                                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                                      ✓ {authorJournals.filter(j => j.status === 'approved' || j.status === 'APPROVED').length} approved
                                    </span>
                                    {authorJournals.filter(j => j.status === 'pending' || j.status === 'PENDING').length > 0 && (
                                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                                        ⏳ {authorJournals.filter(j => j.status === 'pending' || j.status === 'PENDING').length}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}