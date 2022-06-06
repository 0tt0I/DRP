/** @type {import('next').NextConfig} */

const withPwa = require("next-pwa");
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
module.exports = withPwa({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});