import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-geekplus': {
        target: 'http://10.80.227.230:24249',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-geekplus/, '')
      }
    }
  }
})
