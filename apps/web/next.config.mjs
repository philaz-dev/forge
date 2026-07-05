/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@forge/ui",
    "@forge/kernel",
    "@forge/brand",
    "@forge/opportunity",
    "@forge/persistence",
  ],
};

export default nextConfig;
