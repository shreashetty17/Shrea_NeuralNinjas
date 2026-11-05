import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Shrea_NeuralNinjas/',
  plugins: [react()],

  server: {
    host: '0.0.0.0',
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