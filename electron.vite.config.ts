import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const defineVars = {
    '__GOOGLE_CLIENT_ID__': JSON.stringify(env.GOOGLE_CLIENT_ID),
    '__GOOGLE_CLIENT_SECRET__': JSON.stringify(env.GOOGLE_CLIENT_SECRET)
  }

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      resolve: {
        alias: {
          '@main': resolve(__dirname, 'src/main'),
          '@main/*': resolve(__dirname, 'src/main/*'),
          '@shared': resolve(__dirname, 'src/shared')
        }
      },
      define: defineVars // Injeta no Main
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      resolve: {
        alias: {
          '@shared': resolve(__dirname, 'src/shared'),
          '@main': resolve(__dirname, 'src/main'),
        }
      },
      // define: defineVars // Injeta no Preload
    },
    renderer: {
      root: resolve(__dirname, 'src/renderer'),
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'src/renderer/index.html')
          }
        }
      },
      resolve: {
        alias: {
          '@shared': resolve(__dirname, 'src/shared'),
          '@renderer': resolve(__dirname, 'src/renderer/src')
        }
      },
      plugins: [react({}), tailwindcss()],
      // define: defineVars // Injeta no Renderer (React)
    }
  }
})