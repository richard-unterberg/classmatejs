import type { VariantsConfig } from "../types"
import createVariantMap from "./createVariantMap"

interface VariantsFactory<Component> {
  variants: (config: VariantsConfig<any, any>) => Component
}

export interface CreateRuntimeVariantMapOptions<T extends string, Component> {
  runtime: Record<string, VariantsFactory<Component>>
  elements: readonly T[]
  variantsConfig: VariantsConfig<any, any>
  fallbackTag: string
  warn?: (message: string) => void
}

const createRuntimeVariantMap = <T extends string, Component>({
  runtime,
  elements,
  variantsConfig,
  fallbackTag,
  warn,
}: CreateRuntimeVariantMapOptions<T, Component>): Record<T, Component> => {
  const resolveFactory = (tag: string): VariantsFactory<Component> | undefined => {
    const factory = runtime[tag]
    if (!factory || typeof factory.variants !== "function") {
      return undefined
    }
    return factory
  }

  const fallbackFactory = resolveFactory(fallbackTag)

  return createVariantMap<T, Component>({
    elements,
    variantsConfig,
    resolveFactory,
    fallbackFactory,
    warn,
  })
}

export default createRuntimeVariantMap
