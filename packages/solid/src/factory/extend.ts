import { mergeProps } from "solid-js"

import type { CmBaseComponent, Interpolation, LogicHandler, StyleDefinition, VariantsConfig } from "../types"
import createSolidElement from "../util/createSolidElement"

/**
 * Create an extended component builder.
 * Merges the base component’s computed class names and styles with the new interpolations.
 *
 * @typeParam T - The type of the props passed to the interpolation function.
 * @param baseComponent - The base component to extend.
 * @param strings - Template strings array for the new styles.
 * @param interpolations - Interpolations for the new styles.
 * @returns A new styled component with merged class names and styles.
 */
const createExtendedComponent = <T extends object>(
  baseComponent: CmBaseComponent<any>,
  strings: TemplateStringsArray,
  interpolations: Interpolation<T>[],
  logicHandlers: LogicHandler<T>[] = [],
): CmBaseComponent<T> => {
  const displayName = `Extended(${baseComponent.displayName || "Component"})`
  const baseComputeClassName = baseComponent.__scComputeClassName || (() => "")
  const baseStyles = baseComponent.__scStyles || {}
  const tag = baseComponent.__scTag || baseComponent
  const baseLogic = (baseComponent.__scLogic as LogicHandler<any>[]) || []
  const basePropsToFilter = (baseComponent.__scPropsToFilter as (keyof T)[]) || []
  const combinedLogic = [...baseLogic, ...logicHandlers]

  const computeClassName = (props: T, collectedStyles: Record<string, string | number>) => {
    const styleUtility = (styleDef: StyleDefinition<T>) => {
      Object.assign(collectedStyles, styleDef)
      return ""
    }

    type InterpolationProps = T & { style: typeof styleUtility }
    let interpolationProps: InterpolationProps | undefined
    const getInterpolationProps = () => {
      if (!interpolationProps) {
        interpolationProps = mergeProps(props, { style: styleUtility }) as InterpolationProps
      }
      return interpolationProps
    }

    const baseClassName = baseComputeClassName(getInterpolationProps())

    const extendedClassName = strings
      .map((str, i) => {
        const interp = interpolations[i]
        if (typeof interp === "function") {
          return str + interp(getInterpolationProps())
        }
        return str + (interp ?? "")
      })
      .join("")
      .replace(/\s+/g, " ")
      .trim()

    return [baseClassName, extendedClassName].filter(Boolean).join(" ")
  }

  const computeMergedStyles = (props: T) => {
    const collectedStyles: Record<string, string | number> = {}
    computeClassName(props, collectedStyles)
    const resolvedBaseStyles =
      typeof baseStyles === "function" ? (baseStyles as (props: T) => StyleDefinition<T>)(props) : baseStyles
    return { ...resolvedBaseStyles, ...collectedStyles }
  }

  return createSolidElement({
    tag,
    computeClassName: (props) => computeClassName(props, {}),
    displayName,
    styles: (props) => computeMergedStyles(props),
    propsToFilter: basePropsToFilter,
    logicHandlers: combinedLogic as LogicHandler<any>[],
  })
}

const normalizeClassName = (className: string) => className.replace(/\s+/g, " ").trim()

const computeVariantClasses = <VariantProps extends object, ExtraProps extends object>(
  config: VariantsConfig<VariantProps, ExtraProps>,
  props: VariantProps & ExtraProps,
  styleFactory: (styleDef: StyleDefinition<VariantProps & ExtraProps>) => string,
) => {
  const { base, variants, defaultVariants = {} } = config

  const baseClasses = typeof base === "function" ? base({ ...props, style: styleFactory }) : base || ""

  const variantClasses = Object.entries(variants || {}).map(([key, variantOptions]) => {
    const propValue = (props as Record<string, string | undefined>)[key]
    const fallbackValue = (defaultVariants as Record<string, string | undefined>)[key]
    const resolvedValue = propValue ?? fallbackValue

    if (!resolvedValue) {
      return ""
    }

    const option = (variantOptions as Record<string, any>)[resolvedValue]

    if (typeof option === "function") {
      return option({ ...props, style: styleFactory })
    }

    return option || ""
  })

  return normalizeClassName([baseClasses, ...variantClasses].filter(Boolean).join(" "))
}

const createExtendedVariantsComponent = <
  ExtraProps extends object,
  VariantProps extends object,
  ComponentProps extends object = ExtraProps & Partial<VariantProps>,
>(
  baseComponent: CmBaseComponent<any>,
  config: VariantsConfig<VariantProps, ExtraProps>,
  logicHandlers: LogicHandler<ComponentProps>[] = [],
): CmBaseComponent<ComponentProps> => {
  const displayName = `ExtendedVariants(${baseComponent.displayName || "Component"})`
  const baseComputeClassName = baseComponent.__scComputeClassName || (() => "")
  const baseStyles = baseComponent.__scStyles || {}
  const tag = baseComponent.__scTag || baseComponent
  const baseLogic = (baseComponent.__scLogic as LogicHandler<any>[]) || []
  const combinedLogic = [...(baseLogic as LogicHandler<ComponentProps>[]), ...logicHandlers]
  const basePropsToFilter = (baseComponent.__scPropsToFilter as (keyof ComponentProps)[]) || []
  const variantPropsToFilter = Object.keys(config.variants || {}) as (keyof ComponentProps)[]
  const propsToFilter = Array.from(new Set([...basePropsToFilter, ...variantPropsToFilter]))

  const computeClassName = (props: ComponentProps, collectedStyles: Record<string, string | number>) => {
    const styleUtility = (styleDef: StyleDefinition<ComponentProps>) => {
      Object.assign(collectedStyles, styleDef)
      return ""
    }

    type InterpolationProps = ComponentProps & { style: typeof styleUtility }
    let interpolationProps: InterpolationProps | undefined
    const getInterpolationProps = () => {
      if (!interpolationProps) {
        interpolationProps = mergeProps(props, { style: styleUtility }) as InterpolationProps
      }
      return interpolationProps
    }

    const baseClassName = baseComputeClassName(getInterpolationProps())

    const variantProps = props as unknown as VariantProps & ExtraProps
    const styleForVariants = styleUtility as unknown as (
      styleDef: StyleDefinition<VariantProps & ExtraProps>,
    ) => string

    const variantClassName = computeVariantClasses(config, variantProps, styleForVariants)

    return [baseClassName, variantClassName].filter(Boolean).join(" ")
  }

  const computeMergedStyles = (props: ComponentProps) => {
    const collectedStyles: Record<string, string | number> = {}
    computeClassName(props, collectedStyles)
    const resolvedBaseStyles =
      typeof baseStyles === "function"
        ? (baseStyles as (props: ComponentProps) => StyleDefinition<ComponentProps>)(props)
        : baseStyles
    return { ...resolvedBaseStyles, ...collectedStyles }
  }

  return createSolidElement({
    tag,
    computeClassName: (props) => computeClassName(props, {}),
    displayName,
    styles: (props) => computeMergedStyles(props),
    propsToFilter,
    logicHandlers: combinedLogic as LogicHandler<any>[],
  })
}

export { createExtendedVariantsComponent }
export default createExtendedComponent
