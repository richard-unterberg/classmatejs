# @classmatejs/solid

[![npm](https://img.shields.io/npm/v/%40classmatejs%2Fsolid)](https://www.npmjs.com/package/@classmatejs/solid)
[![npm bundle size](https://img.shields.io/bundlephobia/min/%40classmatejs%2Fsolid)](https://bundlephobia.com/result?p=%40classmatejs%2Fsolid)


Solid-first bindings for the Classmate runtime. The adapter exposes the exact same API as `@classmatejs/react`
(`cm`, `.variants`, `.extend`, helpers), but renders through Solid components.

> Status: in-progress. The package is private until the Solid adapter reaches feature parity with the React release.

## Installation

```bash
npm install @classmatejs/solid
```

`solid-js` is a peer dependency so bring your own Solid version (>= 1.8).

## Usage

See the [react-adapter README](../react/README.md) for classmate usage.

### Extend with variants

Solid components can now opt into the same `cm.extend().variants` builder as React. Reuse your
template literal base styles but expose a declarative variant API to consumers:

```tsx
interface ButtonProps {
  $isLoading?: boolean
}

const BaseButton = cm.button<ButtonProps>`
  font-semibold
  ${(p) => (p.$isLoading ? "opacity-40" : "opacity-100")}
`

interface VariantExtras extends ButtonProps {
  $tone?: "muted" | "loud"
}

type VariantConfigProps = VariantExtras & JSX.ButtonHTMLAttributes<HTMLButtonElement>

const AccentButton = cm.extend(BaseButton).variants<VariantConfigProps, { $size: "sm" | "lg" }>({
  base: ({ $tone }) => ($tone === "muted" ? "text-slate-500" : "text-white"),
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
```

### Helpers

- `createClassmate(factory)` – evaluate a `cm` factory inside a Solid component without re-creating it per run.
- `convertCmProps(obj, { size: "$size" })` – map host props to `$` props.
- `createVariantMap({ elements: ["h1", "h2"], variantsConfig })` – bulk-generate variant driven components.
- `cmMerge` – the exported `tailwind-merge` instance for ad-hoc class merging.

## Local development

```bash
npm run build -w @classmatejs/solid
```

Tests will land once the adapter stabilizes; for now the build ensures the factories stay type-safe.
