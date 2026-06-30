import type { JSX } from 'react'
import type { CmBaseComponent, Interpolation, LogicHandler, StyleDefinition } from '../types'
import createReactElement from '../util/createReactElement'

const resolveInterpolationValue = (value: unknown) => (typeof value === 'string' ? value : '')

const createTransformedComponent = <T extends object, E extends keyof JSX.IntrinsicElements>(
  baseComponent: CmBaseComponent<any>,
  tag: E,
  strings: TemplateStringsArray,
  interpolations: Interpolation<T>[],
): CmBaseComponent<T> => {
  if (baseComponent.__rcClassmate !== true) {
    throw new Error('cm.transform can only transform classmate components')
  }

  const displayName = `Transformed(${baseComponent.displayName || 'Component'})`
  const baseComputeClassName = baseComponent.__rcComputeClassName || (() => '')
  const baseLogic = (baseComponent.__rcLogic as LogicHandler<any>[]) || []
  const basePropsToFilter = (baseComponent.__rcPropsToFilter as (keyof T)[]) || []

  const computeClassName = (props: T, collectedStyles: StyleDefinition<T> = {}) => {
    const styleUtility = (styleDef: StyleDefinition<T>) => {
      Object.assign(collectedStyles, styleDef)
      return ''
    }

    const interpolationProps = {
      ...props,
      style: styleUtility,
    } as T & { style: typeof styleUtility }

    const baseClassName = baseComputeClassName(interpolationProps, collectedStyles)

    const transformClassName = strings
      .map((str, i) => {
        const interp = interpolations[i]
        if (typeof interp === 'function') {
          return str + resolveInterpolationValue(interp(interpolationProps))
        }
        return str + resolveInterpolationValue(interp)
      })
      .join('')
      .replace(/\s+/g, ' ')
      .trim()

    return [baseClassName, transformClassName].filter(Boolean).join(' ')
  }

  return createReactElement({
    tag,
    computeClassName,
    displayName,
    propsToFilter: basePropsToFilter,
    logicHandlers: baseLogic as LogicHandler<any>[],
  })
}

export default createTransformedComponent
