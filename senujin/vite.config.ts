import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/senujin/', // Use / for dev, /senujin/ for production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  root: command === 'serve' ? '.' : undefined,
}))
