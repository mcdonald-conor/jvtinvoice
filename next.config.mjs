/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Ensure images are properly handled
  images: {
    unoptimized: true,
  },
}

export default nextConfig
