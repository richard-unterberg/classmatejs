> ⚠️ The shared `@classmatejs/core` runtime and the headless `@classmatejs/factory` package are muted for now while we iterate on a new architecture. They remain in the repo for archival purposes but are not part of the build or publish pipeline.

# @classmatejs/core

Shared logic that powers every Classmate adapter. The package ships the DOM metadata, runtime factories (`createBaseComponent`, `createExtendedComponent`, `createVariantsComponent`), and helper utilities consumed by `@classmatejs/react`, `@classmatejs/solid`, and future runtimes.

> Status: workspace-only. `@classmatejs/core` stays private while we evolve the adapter surface, but all exports are already relied on by both React and Solid.

## What's inside?

- **Factories** – runtime-aware component builders for base, extended, and variant-driven components.
- **DOM metadata** – the canonical list of intrinsic tags shared across adapters.
- **Helpers** – logic handler application, runtime prop conversion, and the adapter-friendly `createRuntimeVariantMap`.
- **Types** – shared TypeScript contracts that adapters use to map their JSX primitive types into the runtime.

Adapters lean entirely on this package, so any addition or change here should be treated as a cross-runtime change.

## Development workflow

```bash
# compile the core helpers/factories
npm run build -w @classmatejs/core

# verify both adapters still align with the runtime contracts
npm run test -w @classmatejs/react
npm run test -w @classmatejs/solid
```

Remember that adapters bundle the compiled `dist/` output – changes in `src/` must be built before running their tests locally.

## When to update core?

Reach for this package when you need to:

- Adjust how factories compute class names, styles, or logic handler behavior.
- Share a helper across adapters (e.g., prop conversion or variant map utilities).
- Introduce new metadata that React and Solid should agree on.

Keep adapter-specific behavior out of `@classmatejs/core`; instead, expose generic utilities here and have adapters re-export or wrap them as needed.
