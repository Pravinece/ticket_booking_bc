/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
    basePath: '/3s'
  }
}

module.exports = nextConfig