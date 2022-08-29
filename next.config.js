const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ["firebasestorage.googleapis.com", "medusa-public-images.s3.eu-west-1.amazonaws.com"]
  }
}

module.exports = nextConfig
