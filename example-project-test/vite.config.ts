import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({ // Use function form to access mode
  plugins: [
    react({
      // Add babel configuration
      babel: {
        plugins: [
          // Add the plugin only in development mode
          ...(mode === 'development' ? ['@lucidlayer/babel-plugin-traceform'] : []),
        ],
      },
    }),
  ],
}));
