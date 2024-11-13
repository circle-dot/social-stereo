/** @type {import('next').NextConfig} */
const nextConfig = {
  //Only use standalone for docker
  // output: 'standalone',
  //Remove this remote host on prod
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },
  compress: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    turbo: {
      // Enable tree shaking for better performance
      treeShaking: true,
      // Set memory limit (e.g., 4GB = 4 * 1024 * 1024 * 1024)
      memoryLimit: 4 * 1024 * 1024 * 1024,
      // Use deterministic module IDs for better caching in production
      moduleIdStrategy: process.env.NODE_ENV === 'production' ? 'deterministic' : 'named',
      // Configure resolve extensions for better module resolution
      resolveExtensions: [
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.json',
        '.mjs'
      ]
    }
  }
};

export default nextConfig;
