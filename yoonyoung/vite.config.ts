import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/yoonyoung/wedding/', // GitHub Pages 경로에 맞게 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
