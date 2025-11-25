# @classmatejs

Styled components for class names. For React and SolidJS or even framework agnostic.

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

*Very simplified examples—see the [@classmatejs/react README](packages/react/README.md) for many more features!*

## Features

- Class name-focused components
- CVA like **Variants**
- Extend components (template strings **or** `cm.extend(Component).variants`)
- Dynamic styles
- TypeScript support
- Tested with SSR Frameworks
- Classname merging
- [SolidJS](https://www.solidjs.com/) / [React](https://reactjs.org/) adapters

## Packages and Documentations:

Public Packages:

- [`@classmatejs/react`](packages/react/README.md) — React adapter
- [`@classmatejs/solid`](packages/solid/README.md) — SolidJs adapter
- [`@classmatejs/factory`](packages/factory/README.md) — Framework agnostic factory

## Tailwind Merge

`classmatejs` core using [tailwind-merge](https://github.com/dcastil/tailwind-merge)
under the hood to merge class names. The last class name will always win, so you
can use it to override classes.

## Upcoming

- Advanced IDE integration
  - show generated default class on hover
  - enforce autocompletion and tooltips from the used libs
- Integrate more tests, benchmarks focused on SSR, SSG, react and solid

## Inspiration

- [tailwind-styled-component](https://github.com/MathiasGilson/tailwind-styled-component)
- [cva](https://github.com/joe-bell/cva)
- [twin.macro](https://github.com/ben-rogerson/twin.macro)
