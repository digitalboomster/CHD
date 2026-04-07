import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_DEV_API_PROXY?.trim()

  // `react-is` package root is CJS with a conditional `require`; Vite/Rolldown does not
  // infer named exports (e.g. `isFragment`). Resolve the concrete build file instead.
  const reactIsFile =
    mode === 'production'
      ? 'react-is.production.js'
      : 'react-is.development.js'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        'react-is': path.resolve(
          __dirname,
          'node_modules/react-is/cjs',
          reactIsFile,
        ),
      },
    },
    server: proxyTarget
      ? {
          proxy: {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        }
      : undefined,
  }
})
