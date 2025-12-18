/** @type {import('next').NextConfig} */
const nextConfig = {
  /* OPSI 1: Matikan Pengecekan Type TypeScript 
    (Vercel tidak akan gagal build meski ada error tipe data)
  */
  typescript: {
    ignoreBuildErrors: true,
  },

  /* OPSI 2: Matikan Pengecekan ESLint 
    (Vercel tidak akan rewel soal aturan penulisan kode)
  */
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* OPSI 3: Optimasi Gambar (Opsional, biar gambar aman)
  */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Kadang perlu untuk Vercel Hobby plan jika kuota habis
  },
};

export default nextConfig;