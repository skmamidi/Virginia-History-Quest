import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/Virginia-History-Quest/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: false,
      includeAssets: [
        "assets/quest-compass.png",
        "assets/virginia-atlas-terrain.jpg",
        "data/virginia-outline.geojson",
        "icons/apple-touch-icon.png",
        "icons/quest-compass-192.png",
        "icons/quest-compass-512.png",
        "manifest.webmanifest",
      ],
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{html,js,css,png,json,geojson,webmanifest}"],
        navigateFallback: "index.html",
      },
    }),
  ],
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
});
