// next.config.js
module.exports = {
  images: {
    domains: ['res.cloudinary.com','randomuser.me'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turboMode: true,
  },
};

