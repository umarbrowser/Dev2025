import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/frontend',
  build: {
    outDir: resolve(__dirname, 'public/assets/dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/frontend/main.jsx'),
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/chunk-[name].js',
        assetFileNames: ({ name }) => {
          if (name && name.endsWith('.css')) {
            return 'assets/main.css';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
});
