import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => { // Use function form to access mode
  const isDevelopment = mode === 'development';

  return {
    plugins: [
      react({
        // Add babel configuration
        babel: {
          plugins: [
            // Use the published package name
            '@lucidlayer/babel-plugin-traceform',
            // Note: For this to work reliably without publishing or linking,
            // you might need npm/yarn workspaces or adjust the path manually
            // e.g., '../babel-plugin-inject-id/dist/index.js' if built,
            // or configure resolve aliases. Using the name assumes Node
            // resolution finds it (might require hoisting or workspaces).
          ],
        },
      }),
    ],
    // Optional: Add server config if needed (e.g., port)
    // server: {
    //   port: 3000,
    // },
  };
});
