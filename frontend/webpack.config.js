// Webpack Configuration for Performance Optimization
const path = require('path');
const webpack = require('webpack');

module.exports = {
  // Enable code splitting
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Vendor chunks for better caching
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // Mantine UI library
        mantine: {
          test: /[\\/]node_modules[\\/]@mantine[\\/]/,
          name: 'mantine',
          chunks: 'all',
          priority: 20,
        },
        // React libraries
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
        // Common chunks
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    // Enable runtime chunk for better caching
    runtimeChunk: {
      name: 'runtime',
    },
  },
  
  // Performance hints
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000, // 500KB
  },
  
  // Module resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  
  // Plugins for optimization
  plugins: [
    // Bundle analyzer (only in development)
    process.env.ANALYZE && new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ].filter(Boolean),
};
