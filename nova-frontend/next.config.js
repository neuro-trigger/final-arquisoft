/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['images.unsplash.com'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://api_gateway:8080/api/:path*', // internal docker network
            },
        ];
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig 