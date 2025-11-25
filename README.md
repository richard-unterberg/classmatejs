# classmatejs monorepo

[![npm](https://img.shields.io/npm/v/%40classmatejs%2Freact)](https://www.npmjs.com/package/@classmatejs/react)
[![npm bundle size](https://img.shields.io/bundlephobia/min/%40classmatejs%2Freact)](https://bundlephobia.com/result?p=%40classmatejs%2Freact)

A collection of packages for building composable class name utilities across frameworks. This repo hosts the React adapter, future framework ports, and the public documentation site.

## Packages

- [`@classmatejs/react`](packages/react/README.md) — published React adapter ([docs](https://react-classmate.dev/docs/get-started/))
- [`@classmatejs/core`](packages/core/README.md) — shared runtime planned for future adapters (currently internal-only)
- [`@classmatejs/solid`](packages/solid/README.md) — experimental Solid adapter scaffold
- [`docs`](docs/README.md) — Vite/Vike site that powers [react-classmate.dev](https://react-classmate.dev)

## Getting started

```bash
npm install
npm run dev      # starts docs locally
```

The docs app consumes the local React package via workspace linking, so editing `packages/react` immediately reflects in the site.

## Scripts

- `npm run dev` — run the documentation site locally
- `npm run build` — build every workspace
- `npm run test` — run the React package test suite
- `npm run lint` — lint all workspaces
- `npm run package` — build and publish `@classmatejs/react`

## Publishing workflow

1. Bump the version in `packages/react/package.json` (and any other package you plan to release).
2. Ensure you are logged in under the `classmatejs` npm organization (`npm whoami`).
3. Run `npm run package` from the repo root to build and `npm publish --access public` the React adapter.

## Documentation

The docs live at [react-classmate.dev](https://react-classmate.dev/). To work on them locally:

```bash
cd docs
npm install
npm run dev
```

## Contributing

Issues and pull requests are welcome. Please open an issue describing any bugs or feature ideas, and run `npm run lint` and `npm run test` before submitting changes.
