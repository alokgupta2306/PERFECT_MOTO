import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "axios", "recharts"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/main.jsx", "./src/App.jsx", "./src/pages/Home.jsx"],
    },
  },
});