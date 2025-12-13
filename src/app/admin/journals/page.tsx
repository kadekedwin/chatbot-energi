'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';
import { extractJournalMetadata, isValidAuthorName } from '@/lib/author-extractor';
import { FileText, Upload, Download, Trash2, Eye, Search, Filter } from 'lucide-react';

export default function JournalsPage() {
  const { journals, addJournal, deleteJournal } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isUploading, setIsUploading] = useState(false);
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

  const filteredJournals = journals.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (j.uploader?.name && j.uploader.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                       (j.detectedAuthor && j.detectedAuthor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchFilter = filterStatus === 'all' || j.status.toLowerCase() === filterStatus;
    return matchSearch && matchFilter;
  });

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
                contentPreview: fileContent.substring(0, 1000)
              };
              
              await addJournal(newJournal);
              successCount++;
              resolve();
            } catch (error) {
              console.error(`Error processing ${file.name}:`, error);
              failCount++;
              reject(error);
            }
          };

          reader.onerror = () => {
            console.error(`Error reading ${file.name}`);
            failCount++;
            reject(new Error('File read error'));
          };

          reader.readAsText(file);
        });
      } catch (error) {
        
        continue;
      }
    }

    const message = `✅ Upload Selesai!\n\n` +
      `Total: ${totalFiles} file(s)\n` +
      `Berhasil: ${successCount} file(s) dengan status APPROVED (Hijau) ✅\n` +
      (failCount > 0 ? `Gagal: ${failCount} file(s) ❌` : '');
    
    alert(message);
    
    setIsUploading(false);
    e.target.value = ''; 
  };

  const handleSubmitWithMetadata = async () => {
    if (!uploadFormData.file || !uploadFormData.author) {
      alert('❌ Mohon isi minimal Penulis Asli!');
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
          title: uploadFormData.title,
          detectedAuthor: uploadFormData.author,
          authorInstitution: uploadFormData.authorInstitution || 'Not specified',
          publicationYear: uploadFormData.publicationYear,
          journalSource: uploadFormData.journalSource || 'Unknown',
          doi: uploadFormData.doi || undefined,
          pdfUrl: uploadFormData.pdfUrl || undefined,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          contentPreview: fileContent.substring(0, 1000)
        };

        await addJournal(newJournal);
        alert(`✅ Jurnal "${uploadFormData.title}" berhasil diupload!\n\nPenulis: ${uploadFormData.author}\nInstitusi: ${uploadFormData.authorInstitution}`);

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
        alert('❌ Gagal membaca file!');
        setIsUploading(false);
      };

      reader.readAsText(file);
    } catch (error) {
      alert('❌ Terjadi kesalahan saat upload!');
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    const journal = journals.find(j => j.id === id);
    if (confirm(`Yakin ingin menghapus jurnal "${journal?.title}"?`)) {
      deleteJournal(id);
      alert('🗑️ Jurnal berhasil dihapus!');
    }
  };

  const handleView = (id: string) => {
    const journal = journals.find(j => j.id === id);
    if (journal) {
      const authorInfo = `
═══════════════════════════════════
📄 INFORMASI JURNAL
═══════════════════════════════════

📌 Judul: ${journal.title}

✍️ PENULIS ASLI:
   Nama: ${journal.detectedAuthor || 'Unknown'}
   Institusi: ${journal.authorInstitution || 'Not specified'}
   Tahun: ${journal.publicationYear || 'N/A'}

📚 SUMBER:
   Jurnal: ${journal.journalSource || 'Unknown'}
   DOI: ${journal.doi || 'N/A'}
   ${journal.pdfUrl ? `🔗 Link: ${journal.pdfUrl}` : ''}

📤 UPLOAD INFO:
   Uploader: ${journal.uploader}
   Tanggal: ${journal.uploadDate}
   Status: ${journal.status.toUpperCase()}
   Ukuran: ${journal.fileSize}

📖 KONTEN PREVIEW:
${journal.contentPreview ? journal.contentPreview.substring(0, 300) + '...' : 'No content'}
`;
      alert(authorInfo);
    }
  };

  const handleDownload = (id: string) => {
    const journal = journals.find(j => j.id === id);
    if (journal) {
      
      const blob = new Blob([journal.contentPreview || 'No content'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${journal.title}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert(`📥 Jurnal "${journal.title}" berhasil didownload!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Kelola Jurnal
            </h1>
            <p className="text-slate-600 mt-2">
              Upload, kelola, dan validasi jurnal penelitian energi
            </p>
          </div>
          
          {}
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label htmlFor="file-upload">
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                disabled={isUploading}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Jurnal (Multiple)'}
              </Button>
            </label>
            <Button 
              onClick={() => {
                if (confirm('⚠️ Hapus SEMUA jurnal? Tindakan ini tidak bisa dibatalkan!')) {
                  localStorage.removeItem('enernova-storage');
                  window.location.reload();
                }
              }}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 ml-2"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <p className="text-xs text-slate-500 mt-2">💡 Tip: Gunakan Ctrl+A untuk memilih semua file</p>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600">{journals.length}</div>
              <p className="text-sm text-slate-600">Total Jurnal</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {journals.filter(j => j.status === 'pending').length}
              </div>
              <p className="text-sm text-slate-600">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="border-teal-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-teal-600">
                {journals.filter(j => j.status === 'approved').length}
              </div>
              <p className="text-sm text-slate-600">Approved</p>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {journals.filter(j => j.status === 'rejected').length}
              </div>
              <p className="text-sm text-slate-600">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {}
        <Card className="border-emerald-100">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Cari jurnal berdasarkan judul atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-emerald-600' : ''}
                >
                  Semua
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('pending')}
                  className={filterStatus === 'pending' ? 'bg-yellow-600' : ''}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('approved')}
                  className={filterStatus === 'approved' ? 'bg-teal-600' : ''}
                >
                  Approved
                </Button>
                <Button
                  variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('rejected')}
                  className={filterStatus === 'rejected' ? 'bg-red-600' : ''}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="shadow-xl border-2 border-emerald-100">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <FileText className="w-5 h-5" />
              Daftar Jurnal ({filteredJournals.length})
            </CardTitle>
            <CardDescription>
              Kelola semua jurnal penelitian di satu tempat
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="divide-y">
                {filteredJournals.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Tidak ada jurnal yang ditemukan</p>
                  </div>
                ) : (
                  filteredJournals.map((journal) => (
                    <div key={journal.id} className="p-6 hover:bg-emerald-50/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-slate-900 mb-2">
                            {journal.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-2">
                            <span className="font-medium text-emerald-700">✍️ {journal.detectedAuthor || 'Unknown Author'}</span>
                            {journal.authorInstitution && (
                              <span className="text-xs">🏛️ {journal.authorInstitution}</span>
                            )}
                            {journal.publicationYear && (
                              <span className="text-xs">📆 {journal.publicationYear}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>📤 Uploader: {journal.uploader?.name || 'Unknown'}</span>
                            <span>📅 {new Date(journal.uploadDate).toLocaleDateString('id-ID')}</span>
                            <span>📊 {journal.fileSize}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              journal.status === 'approved' 
                                ? 'bg-emerald-100 text-emerald-700'
                                : journal.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {journal.status === 'approved' ? '✓ Approved' : 
                               journal.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-emerald-600 hover:bg-emerald-50"
                            onClick={() => handleView(journal.id)}
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-teal-600 hover:bg-teal-50"
                            onClick={() => handleDownload(journal.id)}
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(journal.id)}
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

      </div>

      {}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                📝 Informasi Metadata Jurnal
              </CardTitle>
              <CardDescription>
                Lengkapi data penulis asli jurnal untuk referensi yang akurat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Jurnal <span className="text-red-500">*</span>
                </label>
                <Input
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({...uploadFormData, title: e.target.value})}
                  placeholder="Contoh: Analisis Energi Terbarukan Indonesia 2024"
                  className="w-full"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penulis Asli <span className="text-red-500">*</span>
                </label>
                <Input
                  value={uploadFormData.author}
                  onChange={(e) => setUploadFormData({...uploadFormData, author: e.target.value})}
                  placeholder="Contoh: Sutrisno, A., Wijaya, B., et al."
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Format: Nama Belakang, Inisial depan</p>
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institusi / Afiliasi
                </label>
                <Input
                  value={uploadFormData.authorInstitution}
                  onChange={(e) => setUploadFormData({...uploadFormData, authorInstitution: e.target.value})}
                  placeholder="Contoh: Institut Teknologi Bandung"
                  className="w-full"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Publikasi
                </label>
                <Input
                  type="number"
                  value={uploadFormData.publicationYear}
                  onChange={(e) => setUploadFormData({...uploadFormData, publicationYear: e.target.value})}
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Jurnal / Conference
                </label>
                <Input
                  value={uploadFormData.journalSource}
                  onChange={(e) => setUploadFormData({...uploadFormData, journalSource: e.target.value})}
                  placeholder="Contoh: Indonesian Journal of Energy Research"
                  className="w-full"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DOI (Digital Object Identifier)
                </label>
                <Input
                  value={uploadFormData.doi}
                  onChange={(e) => setUploadFormData({...uploadFormData, doi: e.target.value})}
                  placeholder="Contoh: 10.1234/ijer.2024.001"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Format: 10.xxxx/xxxx</p>
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Download PDF (Optional)
                </label>
                <Input
                  type="url"
                  value={uploadFormData.pdfUrl}
                  onChange={(e) => setUploadFormData({...uploadFormData, pdfUrl: e.target.value})}
                  placeholder="https://example.com/journals/paper.pdf"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">User dapat download dari link ini</p>
              </div>

              {}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmitWithMetadata}
                  disabled={isUploading || !uploadFormData.author}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  {isUploading ? '⏳ Mengupload...' : '✅ Upload Jurnal'}
                </Button>
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
                  disabled={isUploading}
                  className="flex-1"
                >
                  ❌ Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
