import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base: "./"' ensures assets are linked relatively. 
  // This is required for GitHub Pages (e.g. https://username.github.io/repo-name/)
  base: './', 
});
