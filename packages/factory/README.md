# @classmatejs/factory

Headless version of the Classmate factory. It reuses the same styling and variants logic from `@classmatejs/core` but, instead of returning framework components, it simply computes class name strings (merged through `tailwind-merge`).

```ts
import cm from "@classmatejs/factory"

const button = cm<{ $tone?: "neutral" | "accent" }>`
  inline-flex items-center justify-center rounded-md font-medium
  ${(p) => (p.$tone === "accent" ? "bg-blue-600 text-white" : "bg-muted text-foreground")}
`

button({ $tone: "accent", className: "h-10 px-4" })
// => "inline-flex items-center ... bg-blue-600 text-white h-10 px-4"
```

The package mirrors the classmate ergonomics while remaining framework agnostic:

- `cm\`...\`` builds a processor function that only returns class strings.
- `cm.variants(config)` produces variant-aware processors (API compatible with a `tailwind-variants` style config).
- `cm.extend(existing)` allows reusing base processors and augmenting them with template literals or variant configs.

```ts
const alert = cm.variants<{ $tone: "info" | "error" }>({
  base: "inline-flex items-center gap-2 rounded px-3 py-2",
  variants: {
    $tone: {
      info: "bg-blue-500 text-white",
      error: "bg-red-500 text-white",
    },
  },
})

const alertWithIcon = cm.extend(alert)<{ $withIcon?: boolean }>`
  ${(p) => (p.$withIcon ? "pl-8" : "")}
`

alertWithIcon({ $tone: "error", $withIcon: true })
// => "inline-flex ... bg-red-500 text-white pl-8"
```

Refer to `@classmatejs/react` for detailed docs — the behavior is identical except that no framework component is created.
