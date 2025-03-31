import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  const plugins = [
    // Basic React support
    react({
      // Only apply Fast Refresh in development mode
      fastRefresh: mode === 'development',
      // Add displayName to components in development
      babel: {
        plugins: [
          [
            'babel-plugin-transform-react-remove-prop-types', 
            { removeImport: true }
          ]
        ]
      }
    }),
    
    // Allow imports using tsconfig paths
    tsconfigPaths(),
    
    // Compression for production builds
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 10240, // only compress files > 10kb
    }),
  ];

  // Add bundle analyzer in analyze mode
  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    );
  }

  return {
    plugins,
    
    // Resolve aliases for cleaner imports
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    
    // Build optimizations
    build: {
      // Output directory
      outDir: 'dist',
      
      // Enable aggressive minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      
      // Generate sourcemaps in development only
      sourcemap: mode !== 'production',
      
      // Configure code splitting
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react', 
              'react-dom', 
              'react-router-dom',
              '@reduxjs/toolkit',
              'react-redux',
              'redux-persist',
            ],
            form: [
              'react-hook-form',
              '@hookform/resolvers',
              'zod',
            ],
            ui: [
              'class-variance-authority',
              'clsx',
              'tailwind-merge',
              'lucide-react',
              'framer-motion',
            ],
          },
        },
      },
    },
    
    // Dev server configuration
    server: {
      port: 3000,
      strictPort: false,
      open: true,
      cors: true,
      proxy: {
        // Proxy API requests to the real backend during development
        '/api/identity': {
          target: env.VITE_IDENTITY_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/identity/, ''),
        },
        '/api/gateway': {
          target: env.VITE_GATEWAY_API_URL || 'http://localhost:5008',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gateway/, ''),
        },
      },
    },
    
    // Enable dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@reduxjs/toolkit',
        'react-redux',
        'react-hook-form',
        '@hookform/resolvers/zod',
        'zod',
      ],
      exclude: [],
    },
  }
});
