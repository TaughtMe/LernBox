/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { version } from './package.json'

// NEU: Node.js-Module zum Schreiben von Dateien importieren
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// NEU: Ein kleines Plugin, das nach dem Build eine version.json-Datei erstellt
const versionPlugin = () => {
  return {
    name: 'version-plugin',
    closeBundle() {
      const versionInfo = { version };
      const outputPath = path.resolve(__dirname, 'docs', 'version.json');
      fs.writeFileSync(outputPath, JSON.stringify(versionInfo));
      console.log(`version.json mit Version ${version} geschrieben nach ${outputPath}`);
    }
  };
};

export default defineConfig({
  base: './',
  build: {
    outDir: 'docs',
  },
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'LernBox',
        short_name: 'LernBox',
        description:
          'Eine interaktive Lern-App mit Karteikarten nach dem Leitner-System.',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === 'document' ||
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'image' ||
              request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-shell-cache-v1',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Tage
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    // NEU: Unser selbstgeschriebenes Plugin hier hinzufügen
    versionPlugin(),
  ],
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})