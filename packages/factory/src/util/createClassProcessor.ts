import { twMerge } from "tailwind-merge"

import type { CfBaseComponent } from "../types"

import type { LogicHandler, StyleDefinition } from "@classmatejs/core"

interface CreateClassProcessorParams<P extends object, Tag> {
  tag: Tag
  computeClassName: (props: P) => string
  displayName: string
  styles?: StyleDefinition<P> | ((props: P) => StyleDefinition<P>)
  propsToFilter?: (keyof P)[]
  logicHandlers?: LogicHandler<P>[]
}

const createClassProcessor = <P extends object, Tag>({
  tag,
  computeClassName,
  displayName,
  styles,
  logicHandlers,
}: CreateClassProcessorParams<P, Tag>): CfBaseComponent<P> => {
  const processor = ((props?: P) => {
    const incomingProps = props ? { ...props } : ({} as P)
    const normalizedProps = incomingProps as P & Record<string, any>
    const computedClassName = computeClassName(normalizedProps)

    const incomingClasses = [
      typeof normalizedProps.class === "string" ? normalizedProps.class : "",
      typeof normalizedProps.className === "string" ? normalizedProps.className : "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim()

    return twMerge(computedClassName, incomingClasses).trim()
  }) as CfBaseComponent<P>

  processor.displayName = displayName || "CmClassProcessor"
  processor.__rcComputeClassName = (props: P) => computeClassName(props)
  processor.__rcStyles = undefined
  processor.__rcTag = tag
  processor.__rcLogic = undefined

  return processor
}

export default createClassProcessor
