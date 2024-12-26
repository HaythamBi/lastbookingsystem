import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    // In production, API calls should go to a deployed backend
    'process.env.VITE_API_URL': JSON.stringify(
      mode === 'production' 
        ? 'https://your-backend-url.com/api'  // Replace with your actual backend URL
        : '/api'
    )
  }
}));