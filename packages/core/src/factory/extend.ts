import type {
  ComponentRenderer,
  Interpolation,
  LogicHandler,
  RuntimeComponent,
  StyleDefinition,
  VariantsConfig,
} from "../types"

const createInterpolationTarget = <Target extends object>(
  props: Target,
  styleFactory: (styleDef: StyleDefinition<Target>) => string,
) =>
  Object.create(props as object, {
    style: {
      value: styleFactory,
      enumerable: false,
    },
  }) as Target & { style: (styleDef: StyleDefinition<Target>) => string }

const createExtendedComponent = <BaseProps extends object, P extends object, Tag>(
  baseComponent: RuntimeComponent<BaseProps>,
  strings: TemplateStringsArray,
  interpolations: Interpolation<P>[],
  renderComponent: ComponentRenderer<Tag>,
  logicHandlers: LogicHandler<P>[] = [],
): RuntimeComponent<P> => {
  const displayName = `Extended(${baseComponent.displayName || "Component"})`
  const baseComputeClassName = baseComponent.__rcComputeClassName || (() => "")
  const baseStyles = baseComponent.__rcStyles || {}
  const tag = (baseComponent.__rcTag as Tag) || (baseComponent as unknown as Tag)
  const baseLogic = (baseComponent.__rcLogic as LogicHandler<BaseProps>[]) || []
  const combinedLogic = [...(baseLogic as unknown as LogicHandler<P>[]), ...logicHandlers]

  const computeClassName = (props: P, collectedStyles: Record<string, string | number>) => {
    const styleUtility = (styleDef: StyleDefinition<P>) => {
      Object.assign(collectedStyles, styleDef)
      return ""
    }

    let extendedInterpolationTarget: (P & { style: (styleDef: StyleDefinition<P>) => string }) | undefined
    const getExtendedInterpolationTarget = () => {
      if (!extendedInterpolationTarget) {
        extendedInterpolationTarget = createInterpolationTarget(props, styleUtility)
      }
      return extendedInterpolationTarget
    }

    let baseInterpolationTarget:
      | (BaseProps & { style: (styleDef: StyleDefinition<BaseProps>) => string })
      | undefined
    const getBaseInterpolationTarget = () => {
      if (!baseInterpolationTarget) {
        baseInterpolationTarget = createInterpolationTarget(
          props as unknown as BaseProps,
          styleUtility as unknown as (styleDef: StyleDefinition<BaseProps>) => string,
        )
      }
      return baseInterpolationTarget
    }

    const baseClassName = baseComputeClassName(getBaseInterpolationTarget())

    const extendedClassName = strings
      .map((str, i) => {
        const interp = interpolations[i]
        if (typeof interp === "function") {
          return str + interp(getExtendedInterpolationTarget())
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
      typeof baseStyles === "function"
        ? (baseStyles as (props: BaseProps) => StyleDefinition<BaseProps>)(props as unknown as BaseProps)
        : baseStyles

    return { ...resolvedBaseStyles, ...collectedStyles } as StyleDefinition<P>
  }

  return renderComponent({
    tag,
    computeClassName: (props) => computeClassName(props, {}),
    displayName,
    styles: (props) => computeMergedStyles(props),
    logicHandlers: combinedLogic,
  })
}

const normalizeClassName = (className: string) => className.replace(/\s+/g, " ").trim()

const computeVariantClasses = <VariantProps extends object, ExtraProps extends object>(
  config: VariantsConfig<VariantProps, ExtraProps>,
  props: VariantProps & ExtraProps,
  styleFactory: (styleDef: StyleDefinition<VariantProps & ExtraProps>) => string,
) => {
  const { base, variants, defaultVariants = {} } = config

  let interpolationTarget:
    | (VariantProps &
        ExtraProps & { style: (styleDef: StyleDefinition<VariantProps & ExtraProps>) => string })
    | undefined

  const getInterpolationTarget = () => {
    if (!interpolationTarget) {
      interpolationTarget = createInterpolationTarget(props, styleFactory)
    }
    return interpolationTarget
  }

  const baseClasses = typeof base === "function" ? base(getInterpolationTarget()) : base ? base : ""

  const variantClasses = Object.entries(variants).map(([key, variantOptions]) => {
    const propValue = (props as Record<string, string | undefined>)[key]
    const fallbackValue = (defaultVariants as Record<string, string | undefined>)[key]
    const resolvedValue = propValue ?? fallbackValue

    if (!resolvedValue) {
      return ""
    }

    const option = (variantOptions as Record<string, any>)[resolvedValue]

    if (typeof option === "function") {
      return option(getInterpolationTarget())
    }

    return option || ""
  })

  return normalizeClassName([baseClasses, ...variantClasses].filter(Boolean).join(" "))
}

const createExtendedVariantsComponent = <
  Tag,
  BaseProps extends object,
  ExtraProps extends object,
  VariantProps extends object,
  ComponentProps extends object,
>(
  baseComponent: RuntimeComponent<BaseProps>,
  config: VariantsConfig<VariantProps, ExtraProps>,
  renderComponent: ComponentRenderer<Tag>,
  logicHandlers: LogicHandler<ComponentProps>[] = [],
): RuntimeComponent<ComponentProps> => {
  const displayName = `ExtendedVariants(${baseComponent.displayName || "Component"})`
  const baseComputeClassName = baseComponent.__rcComputeClassName || (() => "")
  const baseStyles = baseComponent.__rcStyles || {}
  const tag = (baseComponent.__rcTag as Tag) || (baseComponent as unknown as Tag)
  const baseLogic = (baseComponent.__rcLogic as LogicHandler<BaseProps>[]) || []
  const combinedLogic = [...(baseLogic as unknown as LogicHandler<ComponentProps>[]), ...logicHandlers]
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

    let baseInterpolationTarget:
      | (BaseProps & { style: (styleDef: StyleDefinition<BaseProps>) => string })
      | undefined
    const getBaseInterpolationTarget = () => {
      if (!baseInterpolationTarget) {
        baseInterpolationTarget = createInterpolationTarget(
          props as unknown as BaseProps,
          styleUtility as unknown as (styleDef: StyleDefinition<BaseProps>) => string,
        )
      }
      return baseInterpolationTarget
    }

    const baseClassName = baseComputeClassName(getBaseInterpolationTarget())

    const variantClassName = computeVariantClasses(config, variantProps, styleForVariants)

    return [baseClassName, variantClassName].filter(Boolean).join(" ")
  }

  const computeMergedStyles = (props: ComponentProps) => {
    const collectedStyles: Record<string, string | number> = {}
    computeClassName(props, collectedStyles)

    const resolvedBaseStyles =
      typeof baseStyles === "function"
        ? (baseStyles as (props: BaseProps) => StyleDefinition<BaseProps>)(props as unknown as BaseProps)
        : baseStyles

    return {
      ...resolvedBaseStyles,
      ...collectedStyles,
    } as StyleDefinition<ComponentProps>
  }

  return renderComponent({
    tag,
    computeClassName: (props) => computeClassName(props, {}),
    displayName,
    styles: (props) => computeMergedStyles(props),
    propsToFilter,
    logicHandlers: combinedLogic,
  })
}

export { createExtendedVariantsComponent }
export default createExtendedComponent
