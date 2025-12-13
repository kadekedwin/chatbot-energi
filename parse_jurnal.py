#!/usr/bin/env python3
"""
🔬 METADATA EXTRACTION FOR ENERNOVA - HONEST DATA APPROACH
Real metadata scanner untuk Dashboard Admin (HKI Compliant)
Version: 2.0 (Metadata Focused)
Author: Senior Python Data Scientist
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path
import hashlib

try:
    import PyPDF2
except ImportError:
    print("❌ PyPDF2 belum terinstall. Jalankan: pip install PyPDF2")
    exit(1)


class JournalMetadataExtractor:
    def __init__(self, folder_path="data_jurnal"):
        self.folder_path = Path(folder_path)
        self.results = []
        
    def extract_text_from_first_page(self, pdf_path):
        """
        Extract text HANYA dari Halaman 1 (fokus metadata)
        Halaman pertama biasanya berisi: Title, Author, Institution, Abstract
        """
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                
                if len(reader.pages) == 0:
                    return None
                
                # Ambil HANYA halaman pertama
                first_page = reader.pages[0]
                text = first_page.extract_text()
                
                return text
        except Exception as e:
            print(f"   ⚠️  Error reading PDF: {str(e)}")
            return None
    
    def extract_first_author_heuristic(self, text):
        """
        HEURISTIK SEDERHANA - JUJUR (bukan AI magic)
        Logika:
        1. Ambil 10 baris pertama yang tidak kosong
        2. Baris ke-1 = Judul (skip)
        3. Baris ke-2/3 biasanya = Author
        4. Cari pola email karena biasanya dekat author
        5. Validasi: nama harus ada huruf kapital + minimal 2 kata
        """
        if not text:
            return None
        
        # Normalize line breaks dan split
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        if len(lines) < 3:
            return None
        
        # Skip baris pertama (biasanya judul)
        candidate_lines = lines[1:10]  # Check 9 baris setelah judul
        
        # STRATEGI 1: Cari baris yang ada email (99% author ada di situ)
        email_pattern = r'[\w\.-]+@[\w\.-]+'
        for i, line in enumerate(candidate_lines):
            if re.search(email_pattern, line):
                # Ambil 1-2 baris SEBELUM email (biasanya nama author)
                if i > 0:
                    potential_author = candidate_lines[i-1]
                    if self.is_valid_author_name(potential_author):
                        return self.clean_author_name(potential_author)
                
                # Atau ambil dari baris yang sama (sebelum email)
                parts = re.split(email_pattern, line)
                if parts and parts[0].strip():
                    potential_author = parts[0].strip()
                    if self.is_valid_author_name(potential_author):
                        return self.clean_author_name(potential_author)
        
        # STRATEGI 2: Cari baris ke-2 atau ke-3 (format tradisional)
        for line in candidate_lines[:3]:
            # Must have capital letter + minimal 2 kata
            if re.match(r'^[A-Z]', line) and len(line.split()) >= 2:
                if self.is_valid_author_name(line):
                    return self.clean_author_name(line)
        
        # STRATEGI 3: Cari pola "Author:" atau "By:"
        for line in candidate_lines:
            match = re.search(r'(?:Author[s]?|By|Written by|Penulis)[:\s]+([A-Z][a-zA-Z\s\.,]+)', line, re.IGNORECASE)
            if match:
                potential_author = match.group(1).strip()
                if self.is_valid_author_name(potential_author):
                    return self.clean_author_name(potential_author)
        
        # Tidak ditemukan
        return None
    
    def is_valid_author_name(self, name):
        """
        Validasi nama author (reject keywords umum)
        """
        if not name or len(name) < 5:
            return False
        
        # Reject jika terlalu panjang (bukan nama)
        if len(name) > 100:
            return False
        
        # Reject common academic words
        invalid_keywords = [
            'abstract', 'introduction', 'university', 'department', 
            'journal', 'volume', 'issue', 'copyright', 'published',
            'keywords', 'received', 'accepted', 'article', 'paper',
            'research', 'study', 'analysis', 'conclusion', 'references'
        ]
        
        name_lower = name.lower()
        for keyword in invalid_keywords:
            if keyword in name_lower:
                return False
        
        # Must have at least one letter
        if not re.search(r'[a-zA-Z]', name):
            return False
        
        return True
    
    def clean_author_name(self, name):
        """
        Clean dan format author name
        Remove: superscripts, extra spaces, numbers
        """
        # Remove superscripts dan special chars
        name = re.sub(r'[¹²³⁴⁵⁶⁷⁸⁹⁰*†‡§¶#]+', '', name)
        name = re.sub(r'\d+', '', name)  # Remove numbers
        name = re.sub(r'\s+', ' ', name).strip()
        
        # Limit length
        if len(name) > 60:
            name = name[:60].strip()
        
        # Add "et al." jika belum ada
        if 'et al' not in name.lower() and len(name) < 50:
            name += " et al."
        
        return name
    
    def extract_publication_year(self, text):
        """
        Extract tahun publikasi (cari tahun 2015-2025)
        """
        if not text:
            return None
        
        # Search in first 1000 chars
        text_sample = text[:1000]
        
        # Find all 4-digit years
        year_pattern = r'\b(20[1-2][0-9])\b'
        matches = re.findall(year_pattern, text_sample)
        
        # Filter valid years (2015-2025)
        valid_years = [int(y) for y in matches if 2015 <= int(y) <= 2025]
        
        if valid_years:
            # Return most common year
            return str(max(set(valid_years), key=valid_years.count))
        
        return None
    
    def extract_doi(self, text):
        """
        Extract DOI dari teks
        """
        if not text:
            return None
        
        # Pattern DOI: 10.xxxx/xxxxx
        doi_pattern = r'(?:DOI|doi)[:\s]*(10\.\d{4,}\/[^\s]+)'
        match = re.search(doi_pattern, text, re.IGNORECASE)
        
        if match:
            return match.group(1).strip()
        
        return None
    
    def generate_unique_id(self, filename):
        """
        Generate unique ID from filename (deterministic)
        """
        hash_obj = hashlib.md5(filename.encode())
        return f"journal-{hash_obj.hexdigest()[:12]}"
    
    def process_all_pdfs(self):
        """
        Process semua PDF di folder dengan HONEST EXTRACTION
        """
        pdf_files = sorted(list(self.folder_path.glob("*.pdf")))
        
        if not pdf_files:
            print(f"❌ Tidak ada file PDF di folder '{self.folder_path}'")
            return
        
        print("\n" + "=" * 80)
        print("🔬 METADATA EXTRACTION - HONEST DATA APPROACH")
        print(f"📁 Folder: {self.folder_path.absolute()}")
        print(f"📄 Total Files: {len(pdf_files)}")
        print("=" * 80)
        
        success_count = 0
        failed_count = 0
        
        for idx, pdf_file in enumerate(pdf_files, 1):
            print(f"\n[{idx}/{len(pdf_files)}] 📄 {pdf_file.name}")
            
            # Extract text from first page only
            text = self.extract_text_from_first_page(pdf_file)
            
            if text:
                # Extract metadata
                author = self.extract_first_author_heuristic(text)
                year = self.extract_publication_year(text)
                doi = self.extract_doi(text)
                
                # File size in MB
                file_size_mb = pdf_file.stat().st_size / (1024 * 1024)
                
                # Prepare result
                result = {
                    "id": self.generate_unique_id(pdf_file.name),
                    "filename": pdf_file.name,
                    "title": pdf_file.stem,  # Filename tanpa extension
                    "uploader": "Kontributor (System)",
                    "detectedAuthor": author if author else "Author Belum Terdeteksi (Perlu Review Manual)",
                    "authorInstitution": "Not specified",
                    "publicationYear": year,
                    "journalSource": "Unknown",
                    "doi": doi,
                    "pdfUrl": f"./data_jurnal/{pdf_file.name}",
                    "uploadDate": datetime.now().strftime("%Y-%m-%d"),
                    "status": "pending",
                    "fileSize": f"{file_size_mb:.2f} MB",
                    "contentPreview": text[:500]  # First 500 chars for preview
                }
                
                self.results.append(result)
                
                # Print result
                if author:
                    print(f"   ✅ Author: {author}")
                    success_count += 1
                else:
                    print(f"   ⚠️  Author: Tidak Terdeteksi (Perlu Review Manual)")
                    failed_count += 1
                
                if year:
                    print(f"   📅 Year: {year}")
                if doi:
                    print(f"   🔗 DOI: {doi}")
            else:
                print(f"   ❌ Gagal membaca PDF")
                failed_count += 1
        
        print("\n" + "=" * 80)
        print(f"\n📊 HASIL SCANNING:")
        print(f"   ✅ Author terdeteksi: {success_count}")
        print(f"   ⚠️  Author belum terdeteksi: {failed_count}")
        print(f"   📁 Total file: {len(pdf_files)}")
        print(f"   📈 Success rate: {(success_count/len(pdf_files)*100):.1f}%")
    
    def save_to_json(self, output_file="journals_metadata.json"):
        """
        Save hasil ke JSON file (Database sementara)
        """
        output_path = Path(output_file)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 JSON Database disimpan ke: {output_path.absolute()}")
    
    def save_to_typescript(self, output_file="src/lib/journals_metadata.ts"):
        """
        Save hasil ke TypeScript file untuk Frontend
        """
        output_path = Path(output_file)
        
        # Generate TypeScript code
        ts_code = """/**
 * 🔬 AUTO-GENERATED METADATA - HONEST EXTRACTION
 * Generated from PDF scanning (parse_jurnal.py v2.0)
 * Date: """ + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + """
 * Total Journals: """ + str(len(self.results)) + """
 * 
 * ⚠️ PENTING: Data ini hasil ekstraksi OTOMATIS dari halaman pertama PDF.
 * Field "detectedAuthor" yang bernilai "Author Belum Terdeteksi" perlu
 * review manual oleh Admin untuk memastikan akurasi HKI.
 */

export interface JournalMetadata {
  id: string;
  filename: string;
  title: string;
  uploader: string;
  detectedAuthor: string;
  authorInstitution: string;
  publicationYear: string | null;
  journalSource: string;
  doi: string | null;
  pdfUrl: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  fileSize: string;
  contentPreview?: string;
}

export const extractedMetadata: JournalMetadata[] = """
        
        ts_code += json.dumps(self.results, indent=2, ensure_ascii=False)
        ts_code += ";\n\nexport default extractedMetadata;\n"
        
        # Create directory if not exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(ts_code)
        
        print(f"💾 TypeScript file disimpan ke: {output_path.absolute()}")

def main():
    print("\n" + "=" * 80)
    print("🔬 ENERNOVA METADATA EXTRACTOR - HONEST DATA APPROACH")
    print("   Heuristic-Based Author Detection (No AI Magic)")
    print("   HKI Compliant: Real data atau 'Perlu Review Manual'")
    print("=" * 80)
    
    # Initialize extractor
    extractor = JournalMetadataExtractor("data_jurnal")
    
    # Process all PDFs
    extractor.process_all_pdfs()
    
    # Save results
    extractor.save_to_json("journals_metadata.json")
    extractor.save_to_typescript("src/lib/journals_metadata.ts")
    
    print("\n✅ EKSTRAKSI SELESAI!")
    print("\n📋 Next Steps:")
    print("   1. Review 'journals_metadata.json' untuk cek hasil")
    print("   2. Import ke Dashboard: import metadata from '@/lib/journals_metadata'")
    print("   3. Author yang belum terdeteksi muncul dengan badge ORANGE di Admin Dashboard")
    print("   4. Admin dapat approve/reject berdasarkan review manual")
    print("   5. Restart dev server: pnpm dev")
    print("\n💡 Tips:")
    print("   - Scan hanya halaman pertama = fokus metadata, cepat")
    print("   - Heuristik sederhana = transparan, bukan black box AI")
    print("   - 'Perlu Review Manual' = jujur ketika tidak yakin")
    print("\n" + "=" * 80)


if __name__ == "__main__":
    main()
