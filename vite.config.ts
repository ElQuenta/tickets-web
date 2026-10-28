import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode, command, isPreview }) => {
  const plugins = [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ]

  if (command !== 'serve' || isPreview) {
    return { plugins }
  }

  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.API_PROXY_TARGET?.trim() || 'https://localhost:7272'
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
    plugins,
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
