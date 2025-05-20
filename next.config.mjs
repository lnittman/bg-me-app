import withPWA from '@ducanh2912/next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    serverExternalPackages: ['next-auth'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Add runtime configuration for auth routes
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'x-middleware-prefetch',
            value: 'spec-compliant',
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/_offline',
  },
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
