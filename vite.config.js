import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base /v2/: il v2 vive sullo stesso dominio del v1 (niente CORS).
// In dev, il proxy inoltra le API al VPS.
export default defineConfig({
  plugins: [react()],
  base: '/v2/',
  server: {
    proxy: {
      '/analisi': { target: 'http://135.181.155.193:8001', changeOrigin: true }
    }
  }
})
