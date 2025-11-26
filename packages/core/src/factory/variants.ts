import type {
  ComponentRenderer,
  LogicHandler,
  RuntimeComponent,
  StyleDefinition,
  VariantsConfig,
} from "../types"

interface CreateVariantsOptions<P extends object> {
  logic?: LogicHandler<P>[]
  displayName?: string
}

const createVariantsComponent = <
  Tag,
  ExtraProps extends object,
  VariantProps extends object,
  ComponentProps extends object = ExtraProps & Partial<VariantProps>,
>(
  tag: Tag,
  config: VariantsConfig<VariantProps, ExtraProps>,
  renderComponent: ComponentRenderer<Tag>,
  options: CreateVariantsOptions<ComponentProps> = {},
): RuntimeComponent<ComponentProps> => {
  const { base, variants, defaultVariants = {} } = config
  const propsToFilter = Object.keys(variants) as (keyof ComponentProps)[]
  const styles: Record<string, string | number> = {}
  const displayName =
    options.displayName ?? `Variants(${typeof tag === "string" ? (tag as string) : "Component"})`
  const logicHandlers = options.logic ?? []

  const computeClassName = (props: ComponentProps, collectedStyles: Record<string, string | number>) => {
    const styleUtility = (styleDef: StyleDefinition<ComponentProps>) => {
      Object.assign(collectedStyles, styleDef)
      return ""
    }

    const variantProps = props as unknown as VariantProps & ExtraProps
    const styleForVariants = styleUtility as unknown as (
      styleDef: StyleDefinition<VariantProps & ExtraProps>,
    ) => string

    const baseClasses =
      typeof base === "function" ? base({ ...variantProps, style: styleForVariants }) : base || ""

    const variantClasses = Object.entries(variants).map(([key, variantOptions]) => {
      const propValue =
        (props as Record<string, string | undefined>)[key] ??
        (defaultVariants as Record<string, string | undefined>)[key]

      if (!propValue) {
        return ""
      }

      const option =
        (
          variantOptions as Record<
            string,
            | string
            | ((
                props: VariantProps &
                  ExtraProps & { style: (styleDef: StyleDefinition<VariantProps & ExtraProps>) => string },
              ) => string)
          >
        )[propValue] || ""

      if (typeof option === "function") {
        return option({
          ...variantProps,
          style: styleForVariants,
        })
      }
      return option
    })

    return [baseClasses, ...variantClasses].filter(Boolean).join(" ").trim().replace(/\s+/g, " ").trim()
  }

  return renderComponent({
    tag,
    computeClassName: (props) => computeClassName(props, styles),
    displayName,
    styles,
    propsToFilter,
    logicHandlers,
  })
}

export default createVariantsComponent
