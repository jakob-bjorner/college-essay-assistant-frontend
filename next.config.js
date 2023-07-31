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
  };
};
module.exports = nextConfig;
