> ⚠️ The shared `@classmatejs/core` runtime and the headless `@classmatejs/factory` package are muted for now while we iterate on a new architecture. They remain in the repo for archival purposes but are not part of the build or publish pipeline.

# @classmatejs/factory

Headless version of the Classmate factory. It reuses the same styling and variants logic from `@classmatejs/core` but, instead of returning framework components, it simply computes class name strings (merged through `tailwind-merge`). Perfect for CLI renderers, template engines, or other environments where you only need strings.

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

## Factory examples

Each “factory” below mirrors the React/Solid API but remains framework agnostic.

### Base factory (`cm`)

```ts
const badge = cm<{ $tone?: "info" | "danger" }>`
  inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold
  ${(p) => (p.$tone === "danger" ? "bg-red-600 text-white" : "bg-blue-600 text-white")}
`

badge({ $tone: "danger", class: "shadow" })
// => "inline-flex ... bg-red-600 text-white shadow"
```

### Variants factory (`cm.variants`)

```ts
const button = cm.variants<{ $disabled?: boolean }, { $size: "sm" | "lg" }>({
  base: (p) => `inline-flex items-center justify-center font-medium ${p.$disabled ? "opacity-60" : ""}`,
  variants: {
    $size: {
      sm: "text-sm px-3 py-1.5",
      lg: "text-lg px-5 py-3",
    },
  },
  defaultVariants: {
    $size: "sm",
  },
})

button({ $size: "lg" })
// => "inline-flex ... text-lg px-5 py-3"
```

### Extend factory (`cm.extend`)

```ts
const card = cm`
  rounded-xl border bg-white p-4 shadow-sm
`

const cardWithState = cm.extend(card)<{ $highlight?: boolean }>`
  ${(p) => (p.$highlight ? "ring-2 ring-blue-500" : "")}
`

cardWithState({ $highlight: true })
// => "rounded-xl border bg-white p-4 shadow-sm ring-2 ring-blue-500"
```

### Extend + variants (`cm.extend(...).variants`)

```ts
const surface = cm`
  rounded-lg border bg-background p-6
`

const surfaceWithVariants = cm.extend(surface).variants<{ $tone: "default" | "muted" }, { $density: "spacious" | "compact" }>({
  base: (p) => (p.$tone === "muted" ? "bg-muted text-muted-foreground" : ""),
  variants: {
    $density: {
      spacious: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    $density: "spacious",
  },
})

surfaceWithVariants({ $tone: "muted", $density: "compact" })
// => "rounded-lg border bg-background p-6 bg-muted text-muted-foreground gap-2"
```

Refer to `@classmatejs/react` for detailed docs — the runtime behavior is identical except that no framework component is created.
