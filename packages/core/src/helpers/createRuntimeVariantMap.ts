import type { VariantsConfig } from "../types"
import createVariantMap from "./createVariantMap"

interface VariantsFactory<Component, ExtraProps extends object, VariantProps extends object> {
  variants: (config: VariantsConfig<VariantProps, ExtraProps>) => Component
}

export interface CreateRuntimeVariantMapOptions<
  T extends string,
  Component,
  ExtraProps extends object,
  VariantProps extends object,
> {
  runtime: Record<string, VariantsFactory<Component, ExtraProps, VariantProps>>
  elements: readonly T[]
  variantsConfig: VariantsConfig<VariantProps, ExtraProps>
  fallbackTag: string
  warn?: (message: string) => void
}

const createRuntimeVariantMap = <
  T extends string,
  Component,
  ExtraProps extends object,
  VariantProps extends object,
>({
  runtime,
  elements,
  variantsConfig,
  fallbackTag,
  warn,
}: CreateRuntimeVariantMapOptions<T, Component, ExtraProps, VariantProps>): Record<T, Component> => {
  const resolveFactory = (tag: string): VariantsFactory<Component, ExtraProps, VariantProps> | undefined => {
    const factory = runtime[tag]
    if (!factory || typeof factory.variants !== "function") {
      return undefined
    }
    return factory
  }

  const fallbackFactory = resolveFactory(fallbackTag)

  return createVariantMap<T, Component, ExtraProps, VariantProps>({
    elements,
    variantsConfig,
    resolveFactory,
    fallbackFactory,
    warn,
  })
}

export default createRuntimeVariantMap
