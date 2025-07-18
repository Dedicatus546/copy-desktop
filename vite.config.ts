import { execSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { transformerDirectives } from "unocss";
import unocss from "unocss/vite";
import autoImport from "unplugin-auto-import/vite";
import { Vuetify3Resolver } from "unplugin-vue-components/resolvers";
import component from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";
import electron from "vite-plugin-electron/simple";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envDir = resolve(__dirname, "env");
const currentCommitHash = execSync("git rev-parse HEAD")
  .toString()
  .substring(0, 8);

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  define: {
    __COMIT_HASH__: JSON.stringify(currentCommitHash),
  },
  envDir,
  base: "/",
  plugins: [
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: "electron/main.ts",
        vite: {
          resolve: {
            alias: {
              "@electron": resolve(__dirname, "electron"),
            },
          },
          build: {
            target: "esnext",
            rollupOptions: {
              platform: "node",
              // https://github.com/electron-vite/vite-plugin-electron/blob/main/README.zh-CN.md
              // Here are some C/C++ modules them can't be built properly.
              external: [],
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: join(__dirname, "electron/preload.ts"),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer:
        process.env.NODE_ENV === "test"
          ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
            undefined
          : {},
    }),
    vue(),
    autoImport({
      imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
      eslintrc: {
        enabled: true,
      },
    }),
    component({
      resolvers: [Vuetify3Resolver()],
    }),
    unocss({
      transformers: [
        transformerDirectives({
          applyVariable: ["--at-apply", "--uno-apply", "--uno"],
        }),
      ],
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@electron": resolve(__dirname, "electron"),
    },
  },
  build: {
    target: "esnext",
  },
}));
