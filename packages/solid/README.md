# @classmatejs/solid

Experimental Solid adapter for the Classmate runtime. The package mirrors the React API but binds the factories to Solid's JSX primitives.

> Status: prototype. The package is not published yet and exists as a scaffold for future work.

## Goals

- Provide a Solid-first API equivalent to `@classmatejs/react`
- Share as much logic as possible with `@classmatejs/core`
- Offer drop-in helpers for Solid projects (`cm.button`, variants, class merging)

## Working locally

While the adapter is under construction you can iterate via the workspace scripts:

```bash
npm run build -w @classmatejs/solid
npm run lint -w @classmatejs/solid
```

Integration tests will live alongside Solid example apps once the adapter stabilizes.
