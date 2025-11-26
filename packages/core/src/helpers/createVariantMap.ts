import type { VariantsConfig } from "../types"

interface VariantFactory<Component, ExtraProps extends object, VariantProps extends object> {
  variants: (config: VariantsConfig<VariantProps, ExtraProps>) => Component
}

export interface CreateVariantMapOptions<
  T extends string,
  Component,
  ExtraProps extends object,
  VariantProps extends object,
> {
  elements: readonly T[]
  variantsConfig: VariantsConfig<VariantProps, ExtraProps>
  resolveFactory: (tag: T) => VariantFactory<Component, ExtraProps, VariantProps> | undefined
  fallbackFactory?: VariantFactory<Component, ExtraProps, VariantProps>
  warn?: (message: string) => void
}

const createVariantMap = <
  T extends string,
  Component,
  ExtraProps extends object,
  VariantProps extends object,
>({
  elements,
  variantsConfig,
  resolveFactory,
  fallbackFactory,
  warn = console.warn,
}: CreateVariantMapOptions<T, Component, ExtraProps, VariantProps>): Record<T, Component> => {
  const uniqueElements = new Set(elements)
  if (uniqueElements.size !== elements.length) {
    const duplicates = elements.filter((item, index) => elements.indexOf(item) !== index)
    const uniqueDuplicates = Array.from(new Set(duplicates))
    throw new Error(
      `classmate: Duplicate elements detected in createVariantMap: ${uniqueDuplicates.join(
        ", ",
      )}. Each element must be unique.`,
    )
  }

  return elements.reduce<Record<T, Component>>(
    (acc, tag) => {
      const factory = resolveFactory(tag)
      if (factory && typeof factory.variants === "function") {
        acc[tag] = factory.variants(variantsConfig)
        return acc
      }

      if (fallbackFactory && typeof fallbackFactory.variants === "function") {
        warn?.(
          `classmate: Element "${tag}" is not supported by the runtime. Falling back to the provided fallback factory.`,
        )
        acc[tag] = fallbackFactory.variants(variantsConfig)
        return acc
      }

      warn?.(`classmate: Element "${tag}" is not supported and no fallbackFactory was provided.`)
      return acc
    },
    {} as Record<T, Component>,
  )
}

export default createVariantMap
