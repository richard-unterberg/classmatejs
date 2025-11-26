import { createRuntimeVariantMap } from "@classmatejs/core"

import cm from "../cm"
import type { CmBaseComponent, CmIntrinsicElement, VariantsConfig } from "../types"

interface CreateVariantMapOptions<
  T extends CmIntrinsicElement,
  ExtraProps extends object,
  VariantProps extends object = ExtraProps,
> {
  elements: readonly T[]
  variantsConfig: VariantsConfig<VariantProps, ExtraProps>
}

const createVariantMap = <
  T extends CmIntrinsicElement,
  ExtraProps extends object,
  VariantProps extends object = ExtraProps,
>({
  elements,
  variantsConfig,
}: CreateVariantMapOptions<T, ExtraProps, VariantProps>): Record<T, CmBaseComponent<any>> => {
  const runtime = cm as unknown as Record<
    string,
    { variants: (config: VariantsConfig<VariantProps, ExtraProps>) => CmBaseComponent<any> }
  >

  return createRuntimeVariantMap<T, CmBaseComponent<any>, ExtraProps, VariantProps>({
    runtime,
    elements,
    variantsConfig,
    fallbackTag: "div",
    warn: (message) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn(message)
      }
    },
  })
}

export default createVariantMap
