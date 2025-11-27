import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: false,
  splitting: false,
  target: "es2018",
  external: ["solid-js", "solid-js/web", "tailwind-merge"],
  outDir: "dist",
  tsconfig: "./tsconfig.json",
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs.js" : ".js" }
  },
  esbuildOptions(options, context) {
    options.charset = "utf8"
    options.jsx = "automatic"
    options.jsxImportSource = "solid-js"
    if (!options.footer) {
      options.footer = {}
    }
    if (context.format === "cjs") {
      options.footer.js = `
if (module && module.exports && module.exports.default) {
  const __cmExports = module.exports
  const __cmDefault = __cmExports.default
  if (__cmDefault && (typeof __cmDefault === "object" || typeof __cmDefault === "function")) {
    Object.assign(__cmDefault, __cmExports)
    module.exports = __cmDefault
    module.exports.default = module.exports
  }
}
`.trim()
    }
  },
})
