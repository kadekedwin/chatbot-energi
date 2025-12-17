

export function clearAllJournals() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('enernova-storage');
    window.location.reload();
  }
}
