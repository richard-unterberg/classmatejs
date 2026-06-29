import type { DocsConfig } from "@unterberg/nivel"
import { docsGraph } from "../docs/docs.graph"

const docsConfig = {
  graph: docsGraph,
  siteTitle: "@classmatejs",
  siteDescription: "Documentation site powered by @unterberg/nivel.",
  // Add siteUrl to enable automatic sitemap.xml and robots.txt generation.
  // siteUrl: 'https://docs.example.com',
  // Set robots to false to emit noindex/nofollow and a disallow-all robots.txt.
  robots: false,
  // Set customFonts to false if you want to fully own font loading in consumer CSS.
  customFonts: false,
  basePath: "/docs",
} satisfies DocsConfig

export default docsConfig
