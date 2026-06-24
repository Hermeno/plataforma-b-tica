/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.hub88.io' },
      { protocol: 'https', hostname: '**.pragmaticplay.net' },
      { protocol: 'https', hostname: '**.pgsoft.com' },
      { protocol: 'https', hostname: '**.jdbgaming.com' },
      { protocol: 'https', hostname: 'cdn.leaozinho.com.br' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
