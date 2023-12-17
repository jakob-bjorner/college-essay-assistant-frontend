/** @type {import('next').NextConfig} */
const nextConfig = () => {
  const rewrites = () => {
    return [
      {
        source: "/backend/:path*",
        destination: (process.env.BACKEND_URL || "") + "/v2/:path*",
      },
    ];
  };
  return {
    rewrites,
    reactStrictMode: true,
    env: {
      BACKEND_URL: process.env.BACKEND_URL,
    },
  };
};

module.exports = nextConfig;
