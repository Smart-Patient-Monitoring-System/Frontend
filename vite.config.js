import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Fix for SockJS compatibility
  // define: {
  //   global: 'globalThis',
  // },
  
  // resolve: {
  //   alias: {
  //     // Add polyfills for Node.js modules
  //     util: 'util',
  //   },
  // },
  
  // optimizeDeps: {
  //   esbuildOptions: {
  //     define: {
  //       global: 'globalThis'
  //     }
  //   }
  // },
  
  // server: {
  //   port: 5173,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //     },
  //     '/ws': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       ws: true,
  //     }
  //   }
  // }
})


