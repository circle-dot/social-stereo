/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  //Remove this remote host on prod
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },
};

export default nextConfig;
