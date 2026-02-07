import { createComponent, splitProps } from "solid-js"
import type { Component, JSX } from "solid-js"
import { Dynamic } from "solid-js/web"
import { twMerge } from "tailwind-merge"

import type { CmBaseComponent, LogicHandler, StyleDefinition } from "../types"
import applyLogicHandlers from "./applyLogicHandlers"

const toKebabCase = (key: string) => {
  if (key.startsWith("--")) {
    return key
  }
  return key
    .replace(/([A-Z])/g, (_, char: string) => `-${char.toLowerCase()}`)
    .replace(/^-/, "")
    .toLowerCase()
}

const resolveStyleDefinition = <P extends object>(
  styles: StyleDefinition<P> | undefined,
  props: P,
): Record<string, string | number> => {
  if (!styles) {
    return {}
  }

  const normalized: Record<string, string | number> = {}
  const record = styles as Record<string, any>
  for (const rawKey in record) {
    const rawValue = record[rawKey]
    if (rawValue === undefined || rawValue === null) {
      continue
    }
    const resolvedValue = typeof rawValue === "function" ? rawValue(props) : rawValue
    if (resolvedValue === undefined || resolvedValue === null) {
      continue
    }
    normalized[toKebabCase(rawKey)] = resolvedValue
  }

  return normalized
}

const normalizeInlineStyle = (style: Record<string, any> | undefined | null) => {
  if (!style) {
    return {}
  }

  const normalized: Record<string, string | number> = {}
  for (const key in style) {
    const value = style[key]
    if (value === undefined || value === null) {
      continue
    }
    normalized[toKebabCase(key)] = value
  }
  return normalized
}

interface CreateSolidElementParams<T extends object, E extends keyof JSX.IntrinsicElements | Component<any>> {
  tag: E
  computeClassName: (props: T) => string
  displayName: string
  styles?: StyleDefinition<T> | ((props: T) => StyleDefinition<T>)
  propsToFilter?: (keyof T)[]
  logicHandlers?: LogicHandler<T>[]
}

const createSolidElement = <T extends object, E extends keyof JSX.IntrinsicElements | Component<any>>({
  tag,
  computeClassName,
  displayName,
  styles = {},
  propsToFilter = [],
  logicHandlers = [],
}: CreateSolidElementParams<T, E>): CmBaseComponent<T> => {
  const element = ((incomingProps: T) => {
    const normalizedPropsBase =
      logicHandlers.length > 0 ? applyLogicHandlers(incomingProps, logicHandlers) : incomingProps
    const normalizedProps = normalizedPropsBase as T & Record<string, any>

    const normalizedRecord = normalizedProps as Record<string, any>
    const reservedKeys = [
      ...propsToFilter.filter((key): key is keyof T & string => typeof key === "string"),
      "children",
      "class",
      "className",
      "style",
      "__rcOmit",
    ] as readonly string[]
    const [local, forwardedSource] = splitProps(normalizedRecord, reservedKeys)

    const filteredProps: Record<string, any> = {}
    const forwarded = forwardedSource as Record<string, any>
    const omitKeysSource = normalizedRecord.__rcOmit
    const omitKeys =
      Array.isArray(omitKeysSource) && omitKeysSource.length > 0
        ? new Set(
            omitKeysSource.map((key) => {
              if (typeof key === "string") {
                return key
              }
              if (typeof key === "number") {
                return String(key)
              }
              return String(key)
            }),
          )
        : undefined

    for (const key in forwarded) {
      if (omitKeys?.has(key)) {
        continue
      }
      if (!key.startsWith("$")) {
        filteredProps[key] = forwarded[key]
      }
    }

    return createComponent(Dynamic, {
      component: tag as any,
      ...filteredProps,
      get class() {
        const computedClassName = computeClassName(normalizedProps)
        const initialClass = typeof local.class === "string" ? local.class : ""
        const incomingClasses = [initialClass, typeof local.className === "string" ? local.className : ""]
          .filter(Boolean)
          .join(" ")
          .trim()

        return twMerge(computedClassName, incomingClasses)
      },
      get style() {
        const dynamicStylesSource = typeof styles === "function" ? styles(normalizedProps) : styles
        const dynamicStyles = resolveStyleDefinition(dynamicStylesSource, normalizedProps)
        const localStyleSource =
          typeof local.style === "object" && local.style !== null ? local.style : undefined
        const localStyles = normalizeInlineStyle(localStyleSource)
        return { ...dynamicStyles, ...localStyles }
      },
      get children() {
        return local.children
      },
    })
  }) as CmBaseComponent<T>

  element.displayName = displayName || "Cm Component"
  element.__scComputeClassName = (props: T) =>
    computeClassName(logicHandlers.length > 0 ? applyLogicHandlers(props, logicHandlers) : props)
  element.__scStyles = styles
  element.__scTag = tag
  element.__scLogic = logicHandlers

  return element
}

export default createSolidElement
