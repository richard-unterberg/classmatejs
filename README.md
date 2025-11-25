# 🪂 @classmatejs

A javascript tool to separate class name logic, create variants and manage styles. For React and SolidJS.

## 🚩 Transform this

```jsx
const SomeButton = ({ isLoading, ...props }) => {
  const activeClass = isLoading
    ? "bg-blue-400 text-white"
    : "bg-blue-800 text-blue-200";

  return (
    <button
      {...props}
      className={`transition-all mt-5 border-1 md:text-lg text-normal ${someConfig.transitionDurationEaseClass} ${activeClass} ${
        props.className || ""
      }`}
    >
      {props.children}
    </button>
  );
};
```

## 🌤️ Into

```js
const SomeButton = cm.button`
  text-normal
  md:text-lg
  mt-5
  border-1
  transition-all
  ${someConfig.transitionDurationEaseClass}
  ${({ $isLoading }) => ($isLoading ? "opacity-90 pointer-events-none" : "")}
`;
```

## Features

- Class name-focused components
- CVA like **Variants**
- Extend components
- Dynamic styles
- TypeScript support
- Tested with SSR Frameworks
- Classname merging
- [SolidJS](https://www.solidjs.com/) / [React](https://reactjs.org/) adapters

## Packages and Documentations:

Public Packages:

- [`@classmatejs/react`](packages/react/README.md) — React adapter
- [`@classmatejs/solid`](packages/solid/README.md) — SolidJs adapter

Internal:

- [`@classmatejs/core`](packages/core/README.md) — shared runtime
- [`docs`](docs/README.md) — Vite/Vike site that powers [react-classmate.dev](https://react-classmate.dev)

## Tailwind Merge

`classmatejs` core using [tailwind-merge](https://github.com/dcastil/tailwind-merge)
under the hood to merge class names. The last class name will always win, so you
can use it to override classes.

## Upcoming

- Variants for `cm.extend`
- Advanced IDE integration
  - show generated default class on hover
  - enforce autocompletion and tooltips from the used libs
- Integrate more tests, benchmarks focused on SSR, SSG, react and solid

## Inspiration

- [tailwind-styled-component](https://github.com/MathiasGilson/tailwind-styled-component)
- [cva](https://github.com/joe-bell/cva)
- [twin.macro](https://github.com/ben-rogerson/twin.macro)

## Contributing

Issues and pull requests are welcome. Please open an issue describing any bugs or feature ideas, and run `npm run lint` and `npm run test` before submitting changes.

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

