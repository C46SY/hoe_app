import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";


// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [vue()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
    alias: {
      'bin': new URL('./src/ts', import.meta.url).pathname,
      'core': new URL('./src/ts/core', import.meta.url).pathname,
      'game': new URL('./src/ts/game', import.meta.url).pathname,
      'mod': new URL('./src/ts/mod', import.meta.url).pathname,
      'assets': new URL('./src/assets', import.meta.url).pathname,
      'store': new URL('./src/store', import.meta.url).pathname
    }
  }
}));
