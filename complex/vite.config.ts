import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import traceformPlugin from '@lucidlayer/babel-plugin-traceform';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [traceformPlugin],
      },
    }),
  ],
})
