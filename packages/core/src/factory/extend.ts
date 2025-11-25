import type {
  ComponentRenderer,
  Interpolation,
  LogicHandler,
  RuntimeComponent,
  StyleDefinition,
  VariantsConfig,
} from "../types"

const createExtendedComponent = <P extends object, Tag>(
  baseComponent: RuntimeComponent<any>,
  strings: TemplateStringsArray,
  interpolations: Interpolation<P>[],
  renderComponent: ComponentRenderer<Tag>,
  logicHandlers: LogicHandler<P>[] = [],
): RuntimeComponent<P> => {
  const displayName = `Extended(${baseComponent.displayName || "Component"})`
  const baseComputeClassName = baseComponent.__rcComputeClassName || (() => "")
  const baseStyles = baseComponent.__rcStyles || {}
  const tag = (baseComponent.__rcTag as Tag) || (baseComponent as unknown as Tag)
  const baseLogic = (baseComponent.__rcLogic as LogicHandler<any>[]) || []
  const combinedLogic = [...baseLogic, ...logicHandlers]

  const computeClassName = (props: P, collectedStyles: Record<string, string | number>) => {
    const styleUtility = (styleDef: StyleDefinition<P>) => {
      Object.assign(collectedStyles, styleDef)
      return ""
    }

    const baseClassName = baseComputeClassName({
      ...props,
      style: styleUtility,
    })

    const extendedClassName = strings
      .map((str, i) => {
        const interp = interpolations[i]
        if (typeof interp === "function") {
          return str + interp({ ...props, style: styleUtility })
        }
        return str + (interp ?? "")
      })
      .join("")
      .replace(/\s+/g, " ")
      .trim()

    return [baseClassName, extendedClassName].filter(Boolean).join(" ")
  }

  const computeMergedStyles = (props: P) => {
    const collectedStyles: Record<string, string | number> = {}
    computeClassName(props, collectedStyles)

    const resolvedBaseStyles =
      typeof baseStyles === "function" ? (baseStyles as (props: P) => StyleDefinition<P>)(props) : baseStyles

    return { ...resolvedBaseStyles, ...collectedStyles }
  }

  return renderComponent({
    tag,
    computeClassName: (props) => computeClassName(props, {}),
    displayName,
    styles: (props) => computeMergedStyles(props),
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

  const baseClasses = typeof base === "function" ? base({ ...props, style: styleFactory }) : base ? base : ""

  const variantClasses = Object.entries(variants).map(([key, variantOptions]) => {
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
  Tag,
  ExtraProps extends object,
  VariantProps extends object,
  ComponentProps extends object = ExtraProps & Partial<VariantProps>,
>(
  baseComponent: RuntimeComponent<any>,
  config: VariantsConfig<VariantProps, ExtraProps>,
  renderComponent: ComponentRenderer<Tag>,
  logicHandlers: LogicHandler<ComponentProps>[] = [],
): RuntimeComponent<ComponentProps> => {
  const displayName = `ExtendedVariants(${baseComponent.displayName || "Component"})`
  const baseComputeClassName = baseComponent.__rcComputeClassName || (() => "")
  const baseStyles = baseComponent.__rcStyles || {}
  const tag = (baseComponent.__rcTag as Tag) || (baseComponent as unknown as Tag)
  const baseLogic = (baseComponent.__rcLogic as LogicHandler<any>[]) || []
  const combinedLogic = [...baseLogic, ...logicHandlers]
  const propsToFilter = Object.keys(config.variants || {}) as (keyof ComponentProps)[]

  const computeClassName = (props: ComponentProps, collectedStyles: Record<string, string | number>) => {
    const styleUtility = (styleDef: StyleDefinition<ComponentProps>) => {
      Object.assign(collectedStyles, styleDef)
      return ""
    }

    const variantProps = props as unknown as VariantProps & ExtraProps
    const styleForVariants = styleUtility as unknown as (
      styleDef: StyleDefinition<VariantProps & ExtraProps>,
    ) => string

    const baseClassName = baseComputeClassName({
      ...props,
      style: styleUtility,
    })

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

    return {
      ...resolvedBaseStyles,
      ...collectedStyles,
    }
  }

  return renderComponent({
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
