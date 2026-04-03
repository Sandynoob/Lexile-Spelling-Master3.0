import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['@capacitor-community/admob'],
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'www',
    emptyOutDir: true,
    rollupOptions: {
      external: ['@capacitor-community/admob'],
      output: {
        globals: {
          '@capacitor-community/admob': 'capacitorAdMob'
        }
      }
    }
  }
});
