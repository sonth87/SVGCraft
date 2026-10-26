/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@svg-hub/shared'],
    outputFileTracingExcludes: {
      '*': [
        './output/**',
        'output/**',
        './data/browser-profile-*/**',
        './data/crawl-state.json',
        './data/r2-sync-state.json',
      ],
    },
    outputFileTracingIncludes: {
      '/api/**': ['./data/catalog-index.json.gz'],
      '/icon/**': ['./data/catalog-index.json.gz'],
      '/collection/**': ['./data/catalog-index.json.gz'],
      '/': ['./data/catalog-index.json.gz'],
    },
  },
};

export default nextConfig;
