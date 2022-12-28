/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects() {
    return [
      {
        source: "/",
        destination: "/basic",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
