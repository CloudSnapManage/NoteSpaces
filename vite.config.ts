import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages deployment config
  // Replace 'repo-name' with your actual repository name if deploying to https://user.github.io/repo-name/
  // If deploying to https://user.github.io/, leave it as '/'
  base: './', 
});
