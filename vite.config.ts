import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
const base = process.env.BASE_URL || '/';

export default defineConfig({
  base,
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
