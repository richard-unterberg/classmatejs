# @classmatejs/solid

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
