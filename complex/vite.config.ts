import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => { // Use function form to access command
  const isDevelopment = command === 'serve'; // 'serve' is Vite's dev command

  return {
    plugins: [
      react({
        babel: {
          plugins: [
            // Only include the plugin in development mode
            ...(isDevelopment ? ['@lucidlayer/babel-plugin-traceform'] : []),
          ],
        },
      }),
    ],
    // ... other Vite config (if any)
  }
})
