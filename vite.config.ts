import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ViteWidget from '@widget-js/vite-plugin-widget'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/

export default defineConfig((config) => {
  const mode = config.mode
  const isOffline = mode == 'offline'
  const base = isOffline ? './' : '/ai'
  return {
    base,
    build: {
      target: 'es6',
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => ['webview'].includes(tag),
          },
        },
      }),
      UnoCSS(),
      ViteWidget({ generateFullNamePackage: true, generateZip: isOffline }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
  }
})
