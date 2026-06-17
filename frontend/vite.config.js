import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Ensure Node path module is imported

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Maps '@' straight to 'src'
    },
  },
});