import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
const nextConfig = {
  reactStrictMode: true,
};

export default bundleAnalyzer(nextConfig);
