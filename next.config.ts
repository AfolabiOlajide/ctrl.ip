// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config: any) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.externals.push(
            "pino-pretty" /* add any other modules that might be causing the error */
        );
        return config;
    },
};

module.exports = nextConfig;
