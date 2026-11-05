import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Enables opening dist/index.html directly on any computer without a server!
  server: {
    host: '0.0.0.0', // Accessible from any computer on the network (e.g. 192.168.0.101:5173)
    port: 5173,
    cors: true,
    watch: {
      ignored: ['**/dist/**', '**/*.zip', '**/node_modules/**']
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    cors: true
  }
})
