/**
 * UTILITY: Clear All Journals dari LocalStorage
 * 
 * Cara pakai:
 * 1. Buka browser (http://localhost:3000)
 * 2. Tekan F12 (Developer Tools)
 * 3. Tab "Console"
 * 4. Copy-paste kode ini dan Enter:
 * 
 * localStorage.removeItem('enernova-storage');
 * window.location.reload();
 * 
 * Atau gunakan tombol "Clear All Journals" di halaman admin
 */

// Cara alternatif via kode
export function clearAllJournals() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('enernova-storage');
    window.location.reload();
  }
}
