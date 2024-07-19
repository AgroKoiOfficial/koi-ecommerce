import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Apply the CSP header to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com;
              connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com;
              font-src 'self' data:;
              frame-src 'self' https://www.google.com https://www.youtube.com;
              frame-ancestors 'self';
              form-action 'self';
            `.replace(/\n/g, ' ').replace(/\s\s+/g, ' '),
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
