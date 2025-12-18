'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { extractJournalMetadata, isValidAuthorName } from '@/lib/author-extractor';
import { FileText, Upload, CheckCircle, XCircle, Clock, TrendingUp, Award, ArrowLeft } from 'lucide-react';

interface Journal {
  id: string;
  filename: string;
  title: string;
  detectedAuthor: string;
  authorInstitution?: string;
  publicationYear?: string;
  journalSource?: string;
  doi?: string;
  pdfUrl?: string;
  uploadDate: string;
  status: string;
  fileSize: string;
  contentPreview?: string;
  uploader?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  uploaderId?: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusLower = status.toLowerCase();
  const config = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      icon: <Clock className="w-3 h-3" />,
      label: '⏳ Menunggu Review'
    },
    approved: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      icon: <CheckCircle className="w-3 h-3" />,
      label: '✓ Disetujui'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: <XCircle className="w-3 h-3" />,
      label: '✗ Ditolak'
    }
  };

  const current = config[statusLower as keyof typeof config] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}>
      {current.icon}
      {current.label}
    </span>
  );
};

export default function ContributorPage() {
  const { user } = useAuth();
  const { journals, addJournal } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    author: '',
    authorInstitution: '',
    publicationYear: '',
    journalSource: '',
    doi: '',
    pdfUrl: '',
    file: null as File | null
  });

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

  const myJournals = journals.filter(j => j.uploader === user?.name);

  const stats = {
    total: myJournals.length,
    pending: myJournals.filter(j => j.status === 'pending').length,
    approved: myJournals.filter(j => j.status === 'approved').length,
    rejected: myJournals.filter(j => j.status === 'rejected').length
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length === 1) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const extracted = extractJournalMetadata(content || '');

        setUploadFormData({
          title: file.name.replace(/\.[^/.]+$/, ''),
          author: isValidAuthorName(extracted.author) ? extracted.author : '',
          authorInstitution: extracted.authorInstitution || '',
          publicationYear: extracted.publicationYear || new Date().getFullYear().toString(),
          journalSource: '',
          doi: extracted.doi || '',
          pdfUrl: '',
          file: file
        });
        setShowUploadModal(true);
      };

      reader.onerror = () => {

        setUploadFormData({
          title: file.name.replace(/\.[^/.]+$/, ''),
          author: '',
          authorInstitution: '',
          publicationYear: new Date().getFullYear().toString(),
          journalSource: '',
          doi: '',
          pdfUrl: '',
          file: file
        });
        setShowUploadModal(true);
      };

      reader.readAsText(file);
      e.target.value = '';
      return;
    }

    setIsUploading(true);

    let successCount = 0;
    let failCount = 0;
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        await new Promise<void>((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = async (event) => {
            try {
              const fileContent = event.target?.result as string;

              const extracted = extractJournalMetadata(fileContent || '');

              const newJournal = {
                filename: file.name,
                title: file.name.replace(/\.[^/.]+$/, ''),
                detectedAuthor: isValidAuthorName(extracted.author) ? extracted.author : 'Unknown Author',
                authorInstitution: extracted.authorInstitution || 'Not specified',
                publicationYear: extracted.publicationYear || new Date().getFullYear().toString(),
                journalSource: 'Unknown',
                doi: extracted.doi || '',
                pdfUrl: '',
                fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                contentPreview: fileContent.substring(0, 5000)
              };

              addJournal(newJournal);
              successCount++;
              resolve();
            } catch (error) {
              failCount++;
              reject(error);
            }
          };

          reader.onerror = () => {
            failCount++;
            reject(new Error('File read error'));
          };

          reader.readAsText(file);
        });
      } catch (error) {
        continue;
      }
    }

    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 20px 28px;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);
        z-index: 9999;
        font-family: system-ui;
        animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 420px;
      ">
        <div style="display: flex; align-items: start; gap: 16px;">
          <svg style="width: 32px; height: 32px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <div style="font-weight: 700; font-size: 18px; margin-bottom: 8px;">✅ Upload Berhasil!</div>
            <div style="font-size: 15px; opacity: 0.95; line-height: 1.5;">
              <strong>${successCount} jurnal</strong> berhasil diupload<br/>
              Status: <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 6px; font-weight: 600;">⏳ PENDING REVIEW</span><br/>
              <small style="opacity: 0.8; font-size: 13px;">Admin akan mereview dalam 24 jam</small>
            </div>
            ${failCount > 0 ? `<div style="margin-top: 8px; padding: 8px; background: rgba(239, 68, 68, 0.15); border-radius: 8px; font-size: 13px;">⚠️ ${failCount} file gagal</div>` : ''}
          </div>
        </div>
      </div>
      <style>
        @keyframes slideIn {
          from { transform: translateX(450px) scale(0.8); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0) scale(1); opacity: 1; }
          to { transform: translateX(450px) scale(0.8); opacity: 0; }
        }
      </style>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    setIsUploading(false);
    e.target.value = '';
  };

  const handleSubmitWithMetadata = async () => {
    if (!uploadFormData.file) return;

    if (!uploadFormData.author.trim()) {
      alert('❌ Mohon isi minimal Penulis Asli jurnal!');
      return;
    }

    setIsUploading(true);
    setShowUploadModal(false);

    try {
      const file = uploadFormData.file;
      const reader = new FileReader();

      reader.onload = async (event) => {
        const fileContent = event.target?.result as string;

        const newJournal = {
          filename: file.name,
          title: uploadFormData.title || file.name.replace(/\.[^/.]+$/, ''),
          detectedAuthor: uploadFormData.author,
          authorInstitution: uploadFormData.authorInstitution || 'Not specified',
          publicationYear: uploadFormData.publicationYear || new Date().getFullYear().toString(),
          journalSource: uploadFormData.journalSource || 'Unknown',
          doi: uploadFormData.doi || '',
          pdfUrl: uploadFormData.pdfUrl || '',
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          contentPreview: fileContent.substring(0, 5000)
        };

        const result = await addJournal(newJournal);

        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px 28px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);
            z-index: 9999;
            font-family: system-ui;
            animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 420px;
          ">
            <div style="display: flex; align-items: start; gap: 16px;">
              <svg style="width: 32px; height: 32px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <div style="font-weight: 700; font-size: 18px; margin-bottom: 8px;">✅ Upload Berhasil!</div>
                <div style="font-size: 15px; opacity: 0.95; line-height: 1.5;">
                  <strong>${uploadFormData.title}</strong><br/>
                  📝 Penulis: <strong>${uploadFormData.author}</strong><br/>
                  ${uploadFormData.authorInstitution ? `🏛️ ${uploadFormData.authorInstitution}<br/>` : ''}
                  Status: <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 6px; font-weight: 600;">⏳ PENDING REVIEW</span><br/>
                  <small style="opacity: 0.8; font-size: 13px;">Admin akan mereview dalam 24 jam</small>
                </div>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.animation = 'slideOut 0.3s ease-in';
          setTimeout(() => notification.remove(), 300);
        }, 5000);

        setUploadFormData({
          title: '',
          author: '',
          authorInstitution: '',
          publicationYear: '',
          journalSource: '',
          doi: '',
          pdfUrl: '',
          file: null
        });
        setIsUploading(false);
      };

      reader.onerror = () => {
        alert('❌ Gagal membaca file. Silakan coba lagi.');
        setIsUploading(false);
      };

      reader.readAsText(file);
    } catch (error) {
      alert('❌ Terjadi kesalahan saat upload. Silakan coba lagi.');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        { }
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Beranda
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-10 h-10 text-emerald-600" />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Portal Kontributor
                </h1>
                <p className="text-slate-600 mt-1">
                  Selamat datang, <strong>{user?.name}</strong> 👋
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-2 ml-[52px]">
              <Clock className="w-4 h-4" />
              {currentTime}
            </p>
          </div>

          { }
          <div className="text-right">
            <input
              type="file"
              id="contributor-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button
              onClick={() => document.getElementById('contributor-upload')?.click()}
              disabled={isUploading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all text-base px-6 py-6"
            >
              <Upload className="w-5 h-5 mr-2" />
              {isUploading ? '⏳ Uploading...' : 'Upload Jurnal Baru'}
            </Button>
            <p className="text-xs text-slate-500 mt-2">
              💡 <strong>Tip:</strong> Gunakan <kbd className="px-2 py-1 bg-slate-200 rounded text-xs font-mono">Ctrl+A</kbd> untuk memilih semua file
            </p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">
              ✓ Mendukung: PDF, DOC, DOCX, TXT (max 10MB/file)
            </p>
          </div>
        </div>

        { }
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-t-4 border-t-emerald-600 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Total Kontribusi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-600">{stats.total}</div>
              <p className="text-xs text-slate-500 mt-1">Jurnal diupload</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-yellow-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                Dalam Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-slate-500 mt-1">Menunggu persetujuan</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-teal-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                Diterima
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-teal-600">{stats.approved}</div>
              <p className="text-xs text-slate-500 mt-1">Masuk database AI</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-red-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                Ditolak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-slate-500 mt-1">Perlu perbaikan</p>
            </CardContent>
          </Card>
        </div>

        { }
        {stats.approved >= 5 && (
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-3 rounded-full">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 text-lg">🏆 Kontributor Aktif!</h3>
                  <p className="text-amber-700 text-sm">
                    Anda telah berkontribusi <strong>{stats.approved} jurnal</strong> yang telah disetujui. Terima kasih atas dedikasi Anda! 🎉
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        { }
        <Card className="shadow-xl border-2 border-emerald-100">
          <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="w-5 h-5" />
              Riwayat Upload Saya
            </CardTitle>
            <CardDescription className="text-slate-600">
              Track status dan kelola kontribusi jurnal Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {myJournals.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Belum Ada Upload
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Mulai kontribusi dengan upload jurnal penelitian energi terbarukan Anda sekarang!
                  </p>
                  <Button
                    onClick={() => document.getElementById('contributor-upload')?.click()}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Jurnal Pertama
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {myJournals.map((journal) => (
                    <div key={journal.id} className="p-6 hover:bg-emerald-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 flex-1">
                          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-xl">
                            <FileText className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-slate-900 mb-2">
                              {journal.title}
                            </h3>

                            { }
                            {journal.detectedAuthor && (
                              <div className="mb-2">
                                <span className="font-medium text-emerald-700 text-base">
                                  ✍️ {journal.detectedAuthor}
                                </span>
                                {journal.authorInstitution && (
                                  <span className="text-xs text-slate-600 ml-2">
                                    🏛️ {journal.authorInstitution}
                                  </span>
                                )}
                                {journal.publicationYear && (
                                  <span className="text-xs text-slate-600 ml-2">
                                    📆 {journal.publicationYear}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                              <span className="flex items-center gap-1">
                                👤 Diupload: <strong>{journal.uploader?.name || 'Unknown'}</strong>
                              </span>
                              <span className="flex items-center gap-1">
                                📅 {new Date(journal.uploadDate).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                📊 {journal.fileSize}
                              </span>
                              <span className="flex items-center gap-1">
                                🆔 {journal.id.substring(0, 12)}...
                              </span>
                            </div>
                            <StatusBadge status={journal.status} />

                            {journal.status === 'pending' && (
                              <p className="text-xs text-slate-500 mt-2 italic">
                                ⏱️ Sedang dalam review oleh admin. Estimasi: 24 jam
                              </p>
                            )}
                            {journal.status === 'approved' && (
                              <p className="text-xs text-emerald-600 mt-2 font-medium">
                                ✨ Jurnal ini sudah masuk ke database AI dan dapat digunakan untuk menjawab pertanyaan!
                              </p>
                            )}
                            {journal.status === 'rejected' && (
                              <p className="text-xs text-red-600 mt-2 font-medium">
                                💡 Silakan perbaiki dan upload ulang dengan format/konten yang sesuai
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        { }
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Panduan Upload Jurnal
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✓ <strong>Format file:</strong> PDF, DOC, DOCX, atau TXT (max 10 MB per file)</li>
              <li>✓ <strong>Topik:</strong> Energi terbarukan, hilirisasi nikel, teknologi baterai, SDG 7</li>
              <li>✓ <strong>Single upload:</strong> Isi metadata lengkap (penulis, institusi, dll)</li>
              <li>✓ <strong>Multiple upload:</strong> Gunakan Ctrl+A untuk upload cepat (metadata basic)</li>
              <li>✓ <strong>Review time:</strong> Admin akan mereview dalam 24 jam kerja</li>
              <li>✓ <strong>Status:</strong> Pending → Admin review → Approved/Rejected</li>
            </ul>
          </CardContent>
        </Card>

      </div>

      { }
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            { }
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Upload Jurnal dengan Metadata
              </h2>
              <p className="text-emerald-100 text-sm mt-1">
                Isi informasi penulis asli jurnal agar admin dapat memverifikasi dengan mudah
              </p>
            </div>

            { }
            <div className="p-6 space-y-4">
              { }
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  📌 Judul Jurnal
                </label>
                <input
                  type="text"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  placeholder="Contoh: Analisis Hilirisasi Nikel Indonesia 2024"
                />
              </div>

              { }
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ✍️ Penulis Asli Jurnal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadFormData.author}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, author: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-emerald-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  placeholder="Contoh: Sutrisno, A., et al."
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  💡 Wajib diisi - Nama penulis asli dari jurnal/artikel ini
                </p>
              </div>

              { }
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  🏛️ Institusi Penulis
                </label>
                <input
                  type="text"
                  value={uploadFormData.authorInstitution}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, authorInstitution: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  placeholder="Contoh: Institut Teknologi Bandung"
                />
              </div>

              { }
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    📆 Tahun Publikasi
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.publicationYear}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, publicationYear: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    📚 Nama Jurnal/Conference
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.journalSource}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, journalSource: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                    placeholder="IEEE Journal"
                  />
                </div>
              </div>

              { }
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  🔗 DOI (Digital Object Identifier)
                </label>
                <input
                  type="text"
                  value={uploadFormData.doi}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, doi: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  placeholder="Contoh: 10.1234/ijme.2024.001"
                />
              </div>

              { }
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  📥 Link Download PDF (Opsional)
                </label>
                <input
                  type="url"
                  value={uploadFormData.pdfUrl}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, pdfUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  placeholder="https://example.com/journals/file.pdf"
                />
              </div>

              { }
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  📄 <strong>File:</strong> {uploadFormData.file?.name}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  📊 <strong>Ukuran:</strong> {uploadFormData.file ? `${(uploadFormData.file.size / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  👤 <strong>Diupload oleh:</strong> {user?.name || 'Kontributor'}
                </p>
              </div>

              { }
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Catatan:</strong> Field bertanda <span className="text-red-500">*</span> wajib diisi.
                  Metadata yang lengkap akan mempercepat proses review oleh admin.
                </p>
              </div>
            </div>

            { }
            <div className="flex gap-3 p-6 bg-slate-50 rounded-b-2xl">
              <Button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFormData({
                    title: '',
                    author: '',
                    authorInstitution: '',
                    publicationYear: '',
                    journalSource: '',
                    doi: '',
                    pdfUrl: '',
                    file: null
                  });
                }}
                variant="outline"
                className="flex-1 border-2 hover:bg-slate-100"
                disabled={isUploading}
              >
                ❌ Batal
              </Button>
              <Button
                onClick={handleSubmitWithMetadata}
                disabled={isUploading || !uploadFormData.author.trim()}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white disabled:opacity-50"
              >
                {isUploading ? '⏳ Uploading...' : '✅ Upload Jurnal'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
