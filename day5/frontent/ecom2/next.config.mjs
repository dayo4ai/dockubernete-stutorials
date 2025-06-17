/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    turbotrace: true
  },
  images: {
    domains: ['picsum.photos']
  }
}

export default nextConfig
