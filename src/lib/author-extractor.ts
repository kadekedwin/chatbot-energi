/**
 * Auto-Extract Author dari Konten Jurnal/Artikel Ilmiah
 * ADVANCED SCANNER - Mendukung format akademik internasional
 */

interface ExtractedMetadata {
  author: string;
  authorInstitution?: string;
  publicationYear?: string;
  doi?: string;
}

/**
 * Extract first author dari konten jurnal
 * ENHANCED: Mendukung format IEEE, APA, MLA, Harvard, Springer, Elsevier
 */
export function extractFirstAuthor(content: string): string {
  if (!content) return 'Unknown Author';

  // Normalize dan ambil 3000 karakter pertama (lebih detail)
  const text = content.substring(0, 3000).replace(/\s+/g, ' ').trim();

  // Pattern 1: Format standar dengan label explicit
  const labelPatterns = [
    // "Author: Name" atau "Authors: Name1, Name2"
    /(?:Author[s]?|By|Written\s+by|Penulis|Peneliti|Oleh)[:\s]+([A-Z][a-zA-Z\s\.,]+?)(?=\n|\r|Abstract|ABSTRACT|Abstrak|Introduction|INTRODUCTION|Email|Affiliation|Department)/i,
    
    // Format dengan superscript number: "John Doe¹, Jane Smith²"
    /^([A-Z][a-z]+\s+[A-Z][a-z]+[¹²³⁴⁵*]+)/m,
  ];

  for (const pattern of labelPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return cleanAuthorName(match[1]);
    }
  }

  // Pattern 2: Format IEEE/APA - "LastName, F., LastName, S."
  const ieeePattern = /([A-Z][a-z]+,\s*[A-Z]\.(?:\s*[A-Z]\.)?(?:\s+[A-Z][a-z]+)?)/;
  const ieeeMatch = text.match(ieeePattern);
  if (ieeeMatch) {
    return cleanAuthorName(ieeeMatch[1]);
  }

  // Pattern 3: Format "FirstName LastName et al."
  const etalPattern = /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\s+et\s+al\./i;
  const etalMatch = text.match(etalPattern);
  if (etalMatch) {
    return etalMatch[1].trim() + ' et al.';
  }

  // Pattern 4: Cari nama proper di 500 karakter pertama
  const firstLines = text.substring(0, 500);
  const namePattern = /\b([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/g;
  const names: string[] = [];
  let match;
  
  while ((match = namePattern.exec(firstLines)) !== null) {
    const name = match[1];
    // Filter out common words
    if (!isCommonWord(name)) {
      names.push(name);
    }
  }

  if (names.length > 0) {
    return names[0] + (names.length > 1 ? ' et al.' : '');
  }

  return 'Unknown Author';
}

/**
 * Clean dan format author name
 */
function cleanAuthorName(name: string): string {
  let cleaned = name.trim()
    .replace(/\s+/g, ' ')
    .replace(/[¹²³⁴⁵*†‡§¶#]+/g, '') // Remove superscripts
    .replace(/\s+and\s+.*/i, '') // Remove "and ..."
    .replace(/\s+dan\s+.*/i, '') // Remove "dan ..."
    .trim();

  // Ambil first author jika ada koma
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length >= 2) {
      // Format: "LastName, F." atau "LastName, FirstName"
      const lastName = parts[0].trim();
      const firstName = parts[1].trim();
      
      if (firstName.match(/^[A-Z]\.?$/)) {
        // Format: "Doe, J." → "Doe, J. et al."
        cleaned = `${lastName}, ${firstName}`;
      } else {
        // Format: "Doe, John" → "John Doe"
        cleaned = `${firstName} ${lastName}`;
      }
    }
  }

  // Limit length
  if (cleaned.length > 50) {
    cleaned = cleaned.substring(0, 50).trim();
  }

  // Add "et al." jika belum ada
  if (!cleaned.toLowerCase().includes('et al') && cleaned.length < 40) {
    cleaned += ' et al.';
  }

  return cleaned;
}

/**
 * Check if name is common word (reject)
 */
function isCommonWord(name: string): boolean {
  const commonWords = [
    'abstract', 'introduction', 'conclusion', 'references', 'keywords',
    'university', 'department', 'journal', 'volume', 'issue',
    'copyright', 'reserved', 'published', 'received', 'accepted',
    'corresponding', 'email', 'address', 'phone', 'website'
  ];
  
  const lower = name.toLowerCase();
  return commonWords.some(word => lower.includes(word));
}

/**
 * Extract institusi dari konten jurnal
 * ENHANCED: Support international formats
 */
export function extractInstitution(content: string): string | undefined {
  if (!content) return undefined;

  const text = content.substring(0, 3000);

  const institutionPatterns = [
    // Format with superscript: "Department of X, University of Y¹"
    /(?:Department|Departemen|Faculty|Fakultas)\s+(?:of\s+)?([^,\n]+),\s*([A-Z][^,\n¹²³]+)/i,
    
    // University patterns
    /(University\s+of\s+[A-Za-z\s]+)/i,
    /(Universitas\s+[A-Za-z\s]+)/i,
    /(Institut\s+Teknologi\s+[A-Za-z]+)/i,
    
    // Research institutions
    /(BRIN|LIPI|BPPT|BATAN|LAPAN)/i,
    
    // International universities
    /([A-Z][a-z]+\s+University)/i,
  ];

  for (const pattern of institutionPatterns) {
    const match = text.match(pattern);
    if (match) {
      const inst = (match[2] || match[1]).trim()
        .replace(/[¹²³⁴⁵*†‡]+/g, '')
        .replace(/\s+/g, ' ');
      
      if (inst.length > 5 && inst.length < 100) {
        return inst;
      }
    }
  }

  return undefined;
}

/**
 * Extract tahun publikasi dari konten
 * ENHANCED: Multiple detection strategies
 */
export function extractPublicationYear(content: string): string | undefined {
  if (!content) return undefined;

  const text = content.substring(0, 2000);

  // Pattern untuk tahun (2015-2025)
  const yearPatterns = [
    // Format: "Published: 2024" atau "©2024"
    /(?:Published|Publication|Year|Tahun|©|Copyright)[:\s]+(\d{4})/i,
    
    // Format: "(2024)"
    /\((\d{4})\)/,
    
    // Format: "2024" di awal (dalam 500 char pertama)
    /(20[1-2][0-9])/g,
  ];

  const years: number[] = [];
  
  for (const pattern of yearPatterns) {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      const year = parseInt(match[1] || match[0]);
      if (year >= 2015 && year <= 2025) {
        years.push(year);
      }
    }
  }

  if (years.length > 0) {
    // Return most recent year
    return Math.max(...years).toString();
  }

  return undefined;
}

/**
 * Extract DOI dari konten
 */
export function extractDOI(content: string): string | undefined {
  if (!content) return undefined;

  const text = content.substring(0, 2000);

  // Pattern DOI: 10.xxxx/xxxxx
  const doiPattern = /(?:DOI|doi)[:\s]*(10\.\d{4,}\/[^\s]+)/i;
  const match = text.match(doiPattern);
  
  if (match && match[1]) {
    return match[1].trim();
  }

  return undefined;
}

/**
 * Extract semua metadata sekaligus
 */
export function extractJournalMetadata(content: string): ExtractedMetadata {
  return {
    author: extractFirstAuthor(content),
    authorInstitution: extractInstitution(content),
    publicationYear: extractPublicationYear(content),
    doi: extractDOI(content),
  };
}

/**
 * Validate apakah nama author valid (bukan generic text)
 */
export function isValidAuthorName(name: string): boolean {
  if (!name || name === 'Unknown Author') return false;
  
  // Reject generic words
  const invalidWords = [
    'abstract', 'introduction', 'conclusion', 'references',
    'abstract', 'pendahuluan', 'kesimpulan', 'daftar pustaka',
    'journal', 'article', 'paper', 'jurnal', 'artikel'
  ];
  
  const lowerName = name.toLowerCase();
  for (const word of invalidWords) {
    if (lowerName.includes(word)) {
      return false;
    }
  }
  
  // Must contain at least one letter
  return /[a-zA-Z]/.test(name);
}
