import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@bug-reporter/shared': path.resolve(__dirname, './packages/shared/src'),
      '@bug-reporter/bug-reporter-sdk': path.resolve(__dirname, './packages/bug-reporter-sdk')
    },
    dedupe: ['react', 'react-dom', 'html2canvas', 'react-hot-toast']
  },
  optimizeDeps: {
    include: ['html2canvas', 'react-hot-toast']
  }
})
