import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add the Traceform Babel plugin
      babel: {
        plugins: ['@lucidlayer/babel-plugin-traceform'],
      },
    }),
  ],
  build: {
    sourcemap: true, // Enable source maps for build
  },
})
