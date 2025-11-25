import { createRuntimeVariantMap } from "@classmatejs/core"

import cm from "../cm"
import type { CmBaseComponent, CmIntrinsicElement, VariantsConfig } from "../types"

interface CreateVariantMapOptions<T extends CmIntrinsicElement> {
  elements: readonly T[]
  variantsConfig: VariantsConfig<any, any>
}

const createVariantMap = <T extends CmIntrinsicElement>({
  elements,
  variantsConfig,
}: CreateVariantMapOptions<T>): Record<T, CmBaseComponent<any>> => {
  const runtime = cm as unknown as Record<
    string,
    { variants: (config: VariantsConfig<any, any>) => CmBaseComponent<any> }
  >

  return createRuntimeVariantMap<T, CmBaseComponent<any>>({
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
