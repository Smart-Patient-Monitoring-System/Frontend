import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: '/Frontend/',
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    
    // Optimize build for production
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'recharts']
        }
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 5173,
    open: true,
    host: true
  },
  
  // Preview server configuration (for testing production build locally)
  preview: {
    port: 4173,
    host: true
  }

})
