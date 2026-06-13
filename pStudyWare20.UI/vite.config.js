import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Class-material PDFs/DOCs live under public/pstudyware/Documents and are served
  // directly by Vite (dev) and copied to dist on build. Do not proxy these to the API.
})
