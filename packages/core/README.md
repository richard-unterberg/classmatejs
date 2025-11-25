# @classmatejs/core

Shared logic that powers the framework adapters. The package contains the runtime factories, DOM metadata, and utilities that `@classmatejs/react` (and future adapters) consume during build time.

> Status: in-progress. The package is marked `"private": true` and ships only as a workspace dependency today.

## Development

The core package is written in TypeScript. Build outputs are consumed by other packages, so run the usual workspace scripts from the repo root:

```bash
npm run build -w @classmatejs/core
npm run test -w @classmatejs/react # ensures the adapter still works with local core changes
```

## Roadmap

- Finalize the public factories (`base`, `extend`, `variants`)
- Harden shared helpers (`createVariantMap`, `applyLogicHandlers`)
- Document how adapters should integrate with the factories
