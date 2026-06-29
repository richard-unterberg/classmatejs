import type { DocPageData } from "@unterberg/nivel"

const data: DocPageData = {
  page: {
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
  headings: [
    {
      depth: 2,
      id: "next-steps",
      title: "Next steps",
    },
  ],
  previousPage: null,
  nextPage: null,
}

const pageData = () => {
  return data
}

export default pageData
