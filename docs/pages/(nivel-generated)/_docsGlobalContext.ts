import type { DocsGlobalContextData, DocsGlobalContextSerializableData, DocsIconMap } from "@unterberg/nivel"

const docsGlobalContextSerializableData: DocsGlobalContextSerializableData = {
  siteTitle: "@classmatejs",
  robots: false,
  basePath: "/docs",
  theme: {
    light: "consumer-light",
    dark: "consumer-dark",
    defaultPreference: "light",
  },
  footer: {
    pagination: false,
  },
  brand: {
    text: "@classmatejs",
    href: "/",
    logoAlt: "@classmatejs logo",
  },
  head: {
    customFonts: false,
    fontPreset: "none",
    fontPreloadHrefs: [],
  },
  partners: {
    primary: [],
    gold: [],
  },
  social: {},
  pages: [
    {
      kind: "page",
      id: "gettingStarted",
      title: "Getting Started",
      slug: "getting-started",
      source: "content/getting-started/content.mdx",
      description: "Getting started with @unterberg/nivel.",
      aliases: [],
      href: "/docs/getting-started/",
      aliasHrefs: [],
      tableOfContents: true,
      sectionId: "docs",
      documentTitle: "Getting Started | @classmatejs",
    },
  ],
  navbarItems: [
    {
      id: "docs",
      title: "Docs",
      href: "/docs/getting-started/",
    },
  ],
  topBarNav: {
    kind: "none",
    items: [],
  },
  sidebarSections: [
    {
      id: "docs",
      title: "Docs",
      navTitle: "Docs",
      href: "/docs/getting-started/",
      items: [
        {
          kind: "page",
          id: "gettingStarted",
          title: "Getting Started",
          navTitle: "Getting Started",
          href: "/docs/getting-started/",
          showInNav: true,
        },
      ],
    },
  ],
}

const docsIconMap: DocsIconMap = {}

const docsGlobalContextData: DocsGlobalContextData = {
  ...docsGlobalContextSerializableData,
  docsIconMap,
}

export { docsGlobalContextData }
