import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add the Traceform Babel plugin ONLY during development
      babel: {
        plugins: [
          // Only apply the plugin in development mode
          ...(process.env.NODE_ENV === 'development' ? ['@lucidlayer/babel-plugin-traceform'] : [])
        ],
      },
    }),
  ],
  // Ensure sourcemaps are enabled for debugging if needed
  // build: {
  //   sourcemap: true,
  // },
})
