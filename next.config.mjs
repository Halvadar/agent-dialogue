/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: DANGEROUS, Remove these when all the errors are fixed
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
