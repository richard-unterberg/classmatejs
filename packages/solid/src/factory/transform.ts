import { mergeProps } from "solid-js"
import type { JSX } from "solid-js"
import type { CmBaseComponent, Interpolation, LogicHandler, StyleDefinition } from "../types"
import createSolidElement from "../util/createSolidElement"

const resolveInterpolationValue = (value: unknown) => (typeof value === "string" ? value : "")

const createTransformedComponent = <T extends object, E extends keyof JSX.IntrinsicElements>(
  baseComponent: CmBaseComponent<any>,
  tag: E,
  strings: TemplateStringsArray,
  interpolations: Interpolation<T>[],
): CmBaseComponent<T> => {
  if (baseComponent.__scClassmate !== true) {
    throw new Error("cm.transform can only transform classmate components")
  }

  const displayName = `Transformed(${baseComponent.displayName || "Component"})`
  const baseComputeClassName = baseComponent.__scComputeClassName || (() => "")
  const baseStyles = baseComponent.__scStyles || {}
  const baseLogic = (baseComponent.__scLogic as LogicHandler<any>[]) || []
  const basePropsToFilter = (baseComponent.__scPropsToFilter as (keyof T)[]) || []

  const computeClassName = (props: T, collectedStyles: Record<string, string | number>) => {
    const styleUtility = (styleDef: StyleDefinition<T>) => {
      Object.assign(collectedStyles, styleDef)
      return ""
    }

    type InterpolationProps = T & { style: typeof styleUtility }
    let interpolationProps: InterpolationProps | undefined
    const getInterpolationProps = () => {
      if (!interpolationProps) {
        interpolationProps = mergeProps(props, { style: styleUtility }) as InterpolationProps
      }
      return interpolationProps
    }

    const baseClassName = baseComputeClassName(getInterpolationProps())

    const transformClassName = strings
      .map((str, i) => {
        const interp = interpolations[i]
        if (typeof interp === "function") {
          return str + resolveInterpolationValue(interp(getInterpolationProps()))
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

  return createSolidElement({
    tag,
    computeClassName: (props) => computeClassName(props, {}),
    displayName,
    styles: (props) => computeMergedStyles(props),
    propsToFilter: basePropsToFilter,
    logicHandlers: baseLogic as LogicHandler<any>[],
  })
}

export default createTransformedComponent
