import { createNivelVikeConfig } from "@unterberg/nivel/vike"
import docsConfig from "./+docs"

const config = {
  ...createNivelVikeConfig(docsConfig),

  // User-facing Vike levers stay visible in +config.ts.
  prerender: true,
  // ssr: true,
  // prefetchStaticAssets: 'viewport',
}

export default config
