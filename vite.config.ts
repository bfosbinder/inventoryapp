import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Derive base path for GitHub Pages. Default to '/'.
// You can override by setting VITE_BASE in CI (workflow).
const base = '/'

export default defineConfig({
  base,
  plugins: [react()],
})
