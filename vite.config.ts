import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.GITHUB_PAGES === 'true' ? '/onasp-inspecoes/' : '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [],
      },
      includeAssets: ['icons/icon.svg'],
      manifest: false,
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
