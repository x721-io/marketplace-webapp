/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakeimg.pl',
      },
      {
        protocol: 'https',
        hostname: 'marketplace-api-dev.uniultra.xyz',
      },
      {
        protocol: 'https',
        hostname: 'marketplace-api-stg.uniultra.xyz',
      },
      {
        protocol: 'https',
        hostname: 'marketplace-api.uniultra.xyz',
      },
    ]
  }
}

module.exports = nextConfig
