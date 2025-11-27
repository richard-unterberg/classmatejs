import { mergeProps } from "solid-js"

import type { LogicHandler } from "../types"

const applyLogicHandlers = <T extends object>(props: T, logicHandlers: LogicHandler<T>[] = []): T => {
  if (!logicHandlers.length) {
    return props
  }

  let accumulated = props
  const omitKeys: (keyof T | string)[] = []

  for (const handler of logicHandlers) {
    const result = handler(accumulated)
    if (result && typeof result === "object" && Object.keys(result).length > 0) {
      const { __rcOmit, ...rest } = result as { __rcOmit?: (keyof T | string)[] } & Partial<T>
      if (Array.isArray(__rcOmit) && __rcOmit.length > 0) {
        omitKeys.push(...__rcOmit)
      }
      accumulated = mergeProps(accumulated, rest) as T
    }
  }

  if (omitKeys.length > 0) {
    Object.defineProperty(accumulated as Record<string, any>, "__rcOmit", {
      value: Array.from(new Set(omitKeys)),
      enumerable: false,
      configurable: true,
    })
  }

  return accumulated
}

export default applyLogicHandlers
