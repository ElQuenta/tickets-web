import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.API_PROXY_TARGET || 'https://localhost:7272'
  let backendUrl: URL

  try {
    backendUrl = new URL(proxyTarget)
  } catch {
    throw new Error('API_PROXY_TARGET debe ser una URL completa, por ejemplo https://localhost:7272')
  }

  if (!['http:', 'https:'].includes(backendUrl.protocol)) {
    throw new Error('API_PROXY_TARGET debe usar http:// o https://')
  }

  const isLocalBackend = ['localhost', '127.0.0.1', '[::1]'].includes(backendUrl.hostname)

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      proxy: {
        '/api': {
          target: backendUrl.origin,
          changeOrigin: true,
          secure: !isLocalBackend,
        },
      },
    },
  }
})
