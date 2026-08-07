import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output to /dist at the project root — Vercel picks this up via vercel.json
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      // In development, proxy /api calls to the Vercel dev server (port 3000)
      // Run `vercel dev` from the project root instead of `npm run dev`
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
