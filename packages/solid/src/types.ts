import type {
  AllowedTags,
  Interpolation,
  LogicHandler,
  RuntimeComponent,
  StyleDefinition,
  VariantsConfig,
} from "@classmatejs/core"
import type { Component, JSX } from "solid-js"

export type {
  AllowedTags,
  Interpolation,
  LogicHandler,
  VariantsConfig,
  StyleDefinition,
} from "@classmatejs/core"

export type CmIntrinsicElement = Extract<AllowedTags, keyof JSX.IntrinsicElements>

export type InputComponent = Component<any> | CmBaseComponent<any>

/**
 * Base type for styled Solid components.
 *
 * @typeParam P - Props of the component.
 */
export interface CmBaseComponent<P extends object = object> extends RuntimeComponent<P> {
  (props: P): JSX.Element
  displayName?: string
}

/**
 * The `extend` method allows you to create a new styled component from an existing one.
 *
 * @typeParam E - The type of the original component, which can be a Solid component or an existing CmBaseComponent.
 * @param component - The base component to extend.
 * @returns A function that accepts template strings and interpolations, and returns a new styled component.
 * @example
 * ```tsx
 * const SomeBase = cm.div<{ $active?: boolean }>`color: red;`
 * const Extended = cm.extend(SomeBase)<{ $highlighted?: boolean }>`
 *   ${p => p.$highlighted ? 'bg-yellow' : ''}
 *   ${p => p.$active ? 'text-red' : ''}
 * `
 * ```
 */
type ExtendFunction =
  // this must stay here to get "rsc.extend" tooltipped in the IDE
  /**
   * The `extend` method allows you to create a new styled component from an existing one.
   *
   * @typeParam E - The type of the original component, which can be a ForwardRefExoticComponent or a JSXElementConstructor.
   * @param component - The base component to extend.
   * @returns A function that accepts template strings and interpolations, and returns a new styled component.
   * @example
   * ```tsx
   * // Extending a custom component without intrinsic element type
   * const SomeBase = cm.div<{ $active?: boolean }>`color: red;`
   * const Extended = cm.extend(SomeBase)<{ $highlighted?: boolean }>`
   *   ${p => p.$highlighted ? 'bg-yellow' : ''}
   *   ${p => p.$active ? 'text-red' : ''}
   * `
   *
   * // Extending with specific props:
   * const ExtendedButton = cm.extend(StyledButton)<ButtonHTMLAttributes<HTMLButtonElement>>`
   *   ${p => p.type === 'submit' ? 'font-bold' : ''}
   * ```
   */
  <E extends InputComponent, I extends CmIntrinsicElement>(component: E) => ExtendTemplateBuilder<E, I>

export interface ExtendTemplateBuilder<
  E extends InputComponent,
  I extends CmIntrinsicElement,
  LogicProps extends object = object,
> {
  /**
   * Create an extended component by providing template literals + interpolations.
   */
  <T extends object>(
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<MergeProps<E, T> & JSX.IntrinsicElements[I]>[]
  ): CmBaseComponent<MergeProps<E, T>>
  /**
   * Attach logic handlers that run before classnames/styles are computed.
   */
  logic<NextLogic extends object = object>(
    handler: LogicHandler<MergeProps<E, LogicProps & NextLogic>>,
  ): ExtendTemplateBuilder<E, I, LogicProps & NextLogic>
  variants<ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ): CmBaseComponent<MergeProps<E, ExtraProps & Partial<VariantProps>>>
}

/**
 * Base type for the base classes in the variants configuration.
 *
 * This can be a static string or a function that returns a string based on the component's props.
 *
 * @typeParam VariantProps - The props for the variants.
 * @typeParam ExtraProps - Additional props for the component.
 */
type VariantsFunction<K extends CmIntrinsicElement> = <
  ExtraProps extends object,
  VariantProps extends object = ExtraProps,
>(
  config: VariantsConfig<VariantProps, ExtraProps>,
) => CmBaseComponent<MergeProps<K, ExtraProps & Partial<VariantProps>>>

/**
 * Factory for creating styled components with intrinsic elements.
 */
export interface CmFactoryFunction<K extends CmIntrinsicElement> {
  <T extends object>(
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<T>[]
  ): CmBaseComponent<MergeProps<K, T>>
  logic<LogicProps extends object = object>(
    handler: LogicHandler<MergeProps<K, LogicProps>>,
  ): CmFactoryFunction<K>
  variants: VariantsFunction<K>
}

export type CmComponentFactory = {
  [K in CmIntrinsicElement]: CmFactoryFunction<K>
} & {
  extend: ExtendFunction
}

/**
 * Merges additional props with the base props of a given component or intrinsic element.
 *
 * @typeParam E - The base component type or intrinsic element.
 * @typeParam T - Additional props to merge with the base props.
 */
export type MergeProps<E, T> = E extends CmIntrinsicElement
  ? JSX.IntrinsicElements[E] & T
  : E extends Component<infer P>
    ? P & T
    : T
