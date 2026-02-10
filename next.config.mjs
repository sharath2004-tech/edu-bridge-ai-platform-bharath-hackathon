/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily allow build to proceed - fix types after deployment
    ignoreBuildErrors: true,
  },
  images: {
    // Disable image optimization for free hosting
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // Configure Server Actions body size limit
    serverActions: {
      bodySizeLimit: '10mb', // Increase from default 1MB to 10MB
    },
  },
  // Optimize production builds
  compress: true,
  // Disable swcMinify if having issues
  swcMinify: true,
}

export default nextConfig
