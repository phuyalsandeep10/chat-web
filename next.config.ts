import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'flagcdn.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'i.ibb.co',
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
