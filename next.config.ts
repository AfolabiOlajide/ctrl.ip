// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: (config: { externals: string[] }) => {
        config.externals.push(
            "pino-pretty" /* add any other modules that might be causing the error */
        );
        return config;
    },
};

module.exports = nextConfig;
