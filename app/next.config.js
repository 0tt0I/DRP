/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
  // should be using with custom backend but bug in next:
  // https://github.com/vercel/next.js/issues/2682
  // useFileSystemPublicRoutes: false
}

module.exports = nextConfig
