import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const plugins = [
    react({
      babel: {
        plugins: []
      }
    }),

    tsconfigPaths(),

    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 10240,
    }),
  ];

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
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },

    build: {
      outDir: 'dist',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      sourcemap: mode !== 'production',
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

    server: {
      port: 3000,
      strictPort: false,
      open: true,
      cors: true,
      proxy: {
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
