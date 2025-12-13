

interface ExtractedMetadata {
  author: string;
  authorInstitution?: string;
  publicationYear?: string;
  doi?: string;
}

export function extractFirstAuthor(content: string): string {
  if (!content) return 'Unknown Author';

  const text = content.substring(0, 3000).replace(/\s+/g, ' ').trim();

  const labelPatterns = [
    
    /(?:Author[s]?|By|Written\s+by|Penulis|Peneliti|Oleh)[:\s]+([A-Z][a-zA-Z\s\.,]+?)(?=\n|\r|Abstract|ABSTRACT|Abstrak|Introduction|INTRODUCTION|Email|Affiliation|Department)/i,

    /^([A-Z][a-z]+\s+[A-Z][a-z]+[¹²³⁴⁵*]+)/m,
  ];

  for (const pattern of labelPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return cleanAuthorName(match[1]);
    }
  }

  const ieeePattern = /([A-Z][a-z]+,\s*[A-Z]\.(?:\s*[A-Z]\.)?(?:\s+[A-Z][a-z]+)?)/;
  const ieeeMatch = text.match(ieeePattern);
  if (ieeeMatch) {
    return cleanAuthorName(ieeeMatch[1]);
  }

  const etalPattern = /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\s+et\s+al\./i;
  const etalMatch = text.match(etalPattern);
  if (etalMatch) {
    return etalMatch[1].trim() + ' et al.';
  }

  const firstLines = text.substring(0, 500);
  const namePattern = /\b([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/g;
  const names: string[] = [];
  let match;
  
  while ((match = namePattern.exec(firstLines)) !== null) {
    const name = match[1];
    
    if (!isCommonWord(name)) {
      names.push(name);
    }
  }

  if (names.length > 0) {
    return names[0] + (names.length > 1 ? ' et al.' : '');
  }

  return 'Unknown Author';
}

function cleanAuthorName(name: string): string {
  let cleaned = name.trim()
    .replace(/\s+/g, ' ')
    .replace(/[¹²³⁴⁵*†‡§¶#]+/g, '') 
    .replace(/\s+and\s+.*/i, '') 
    .replace(/\s+dan\s+.*/i, '') 
    .trim();

  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length >= 2) {
      
      const lastName = parts[0].trim();
      const firstName = parts[1].trim();
      
      if (firstName.match(/^[A-Z]\.?$/)) {
        
        cleaned = `${lastName}, ${firstName}`;
      } else {
        
        cleaned = `${firstName} ${lastName}`;
      }
    }
  }

  if (cleaned.length > 50) {
    cleaned = cleaned.substring(0, 50).trim();
  }

  if (!cleaned.toLowerCase().includes('et al') && cleaned.length < 40) {
    cleaned += ' et al.';
  }

  return cleaned;
}

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

export function extractInstitution(content: string): string | undefined {
  if (!content) return undefined;

  const text = content.substring(0, 3000);

  const institutionPatterns = [
    
    /(?:Department|Departemen|Faculty|Fakultas)\s+(?:of\s+)?([^,\n]+),\s*([A-Z][^,\n¹²³]+)/i,

    /(University\s+of\s+[A-Za-z\s]+)/i,
    /(Universitas\s+[A-Za-z\s]+)/i,
    /(Institut\s+Teknologi\s+[A-Za-z]+)/i,

    /(BRIN|LIPI|BPPT|BATAN|LAPAN)/i,

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

export function extractPublicationYear(content: string): string | undefined {
  if (!content) return undefined;

  const text = content.substring(0, 2000);

  const yearPatterns = [
    
    /(?:Published|Publication|Year|Tahun|©|Copyright)[:\s]+(\d{4})/i,

    /\((\d{4})\)/,

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
    
    return Math.max(...years).toString();
  }

  return undefined;
}

export function extractDOI(content: string): string | undefined {
  if (!content) return undefined;

  const text = content.substring(0, 2000);

  const doiPattern = /(?:DOI|doi)[:\s]*(10\.\d{4,}\/[^\s]+)/i;
  const match = text.match(doiPattern);
  
  if (match && match[1]) {
    return match[1].trim();
  }

  return undefined;
}

export function extractJournalMetadata(content: string): ExtractedMetadata {
  return {
    author: extractFirstAuthor(content),
    authorInstitution: extractInstitution(content),
    publicationYear: extractPublicationYear(content),
    doi: extractDOI(content),
  };
}

export function isValidAuthorName(name: string): boolean {
  if (!name || name === 'Unknown Author') return false;

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

  return /[a-zA-Z]/.test(name);
}
