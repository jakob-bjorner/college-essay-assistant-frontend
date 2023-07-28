/** @type {import('next').NextConfig} */
const nextConfig = () => {
  const rewrites = () => {
    return [
      {
        source: "/backend/:path*",
        destination: "http://localhost:5000/v1/:path*",
      },
    ];
  };
  return {
    rewrites,
  };
};
module.exports = nextConfig;
