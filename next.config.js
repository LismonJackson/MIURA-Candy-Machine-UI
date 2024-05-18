/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['plum-xenogeneic-gerbil-275.mypinata.cloud'],
  },
}

module.exports = nextConfig;
