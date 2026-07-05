/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@forge/ui",
    "@forge/core",
    "@forge/brand",
    "@forge/database",
    "@forge/types",
  ],
};

export default nextConfig;
