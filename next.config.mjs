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
};

export default nextConfig;
