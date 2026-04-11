import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  },
  server: {
    hmr: {
      overlay: false // Disable the overlay to prevent it from blocking the UI on minor warnings
    },
    watch: {
      usePolling: true // Sometimes helps with stability in certain mount environments
    }
  }
})
