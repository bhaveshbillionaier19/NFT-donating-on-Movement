/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gateway.pinata.cloud',
                pathname: '/ipfs/**',
            },
            {
                protocol: 'https',
                hostname: 'ipfs.io',
                pathname: '/ipfs/**',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Suppress the Set serialization warning in browser console
            config.ignoreWarnings = [
                ...(config.ignoreWarnings || []),
                /Only plain objects can be passed to Client Components from Server Components/,
            ];
        }
        return config;
    },
}

module.exports = nextConfig
