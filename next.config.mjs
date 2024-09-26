/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
//   env: {
//     'ENCRYPTION_KEY': process.env.NEXT_PUBLIC_ENCRYPTION_KEY,
//     'SALT': process.env.NEXT_PUBLIC_SALT_KEY
//   }
//   rewrites: () => [
//     {
//       "source": "/api/(.*)",
//       "destination": "http://139.177.202.65:6543/$1"
//     },
//   ]
};

export default nextConfig;

