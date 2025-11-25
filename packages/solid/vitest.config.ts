import path from "node:path"
import { fileURLToPath } from "node:url"

import solidPlugin from "vite-plugin-solid"
import { defineConfig } from "vitest/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolvePath = (...segments: string[]) => path.resolve(__dirname, ...segments)
const resolveNodeModule = (...segments: string[]) =>
  path.resolve(__dirname, "..", "..", "node_modules", ...segments)

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["test/src/**/*.spec.ts", "test/src/**/*.spec.tsx"],
    globals: true,
    clearMocks: true,
  },
  resolve: {
    conditions: ["browser", "development", "module"],
    alias: [
      {
        find: /^solid-js\/web$/,
        replacement: resolveNodeModule("solid-js", "web", "dist", "web.js"),
      },
    ],
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "solid-js",
  },
})
