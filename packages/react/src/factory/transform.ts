import type { JSX } from "react"
import type { CmBaseComponent, Interpolation, LogicHandler, StyleDefinition } from "../types"
import createReactElement from "../util/createReactElement"

const resolveInterpolationValue = (value: unknown) => (typeof value === "string" ? value : "")

const createTransformedComponent = <T extends object, E extends keyof JSX.IntrinsicElements>(
  baseComponent: CmBaseComponent<any>,
  tag: E,
  strings: TemplateStringsArray,
  interpolations: Interpolation<T>[],
): CmBaseComponent<T> => {
  if (baseComponent.__rcClassmate !== true) {
    throw new Error("cm.transform can only transform classmate components")
  }

  const displayName = `Transformed(${baseComponent.displayName || "Component"})`
  const baseComputeClassName = baseComponent.__rcComputeClassName || (() => "")
  const baseStyles = baseComponent.__rcStyles || {}
  const baseLogic = (baseComponent.__rcLogic as LogicHandler<any>[]) || []
  const basePropsToFilter = (baseComponent.__rcPropsToFilter as (keyof T)[]) || []

  const computeClassName = (props: T, collectedStyles: Record<string, string | number>) => {
    const styleUtility = (styleDef: StyleDefinition<T>) => {
      Object.assign(collectedStyles, styleDef)
      return ""
    }

    const interpolationProps = {
      ...props,
      style: styleUtility,
    } as T & { style: typeof styleUtility }

    const baseClassName = baseComputeClassName(interpolationProps)

    const transformClassName = strings
      .map((str, i) => {
        const interp = interpolations[i]
        if (typeof interp === "function") {
          return str + resolveInterpolationValue(interp(interpolationProps))
        }
        return str + resolveInterpolationValue(interp)
      })
      .join("")
      .replace(/\s+/g, " ")
      .trim()

    return [baseClassName, transformClassName].filter(Boolean).join(" ")
  }

  const computeMergedStyles = (props: T) => {
    const collectedStyles: Record<string, string | number> = {}
    computeClassName(props, collectedStyles)
    const resolvedBaseStyles =
      typeof baseStyles === "function" ? (baseStyles as (props: T) => StyleDefinition<T>)(props) : baseStyles
    return { ...resolvedBaseStyles, ...collectedStyles }
  }

  return createReactElement({
    tag,
    computeClassName: (props) => computeClassName(props, {}),
    displayName,
    styles: (props) => computeMergedStyles(props),
    propsToFilter: basePropsToFilter,
    logicHandlers: baseLogic as LogicHandler<any>[],
  })
}

export default createTransformedComponent
