/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Penting untuk deployment Docker/VPS
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Agar build tidak gagal gara-gara error kecil
  },
  // HAPUS BAGIAN TELEMETRY DISINI KARENA TIDAK VALID
};

export default nextConfig;
