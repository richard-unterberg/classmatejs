import type { JSX } from "react"

import createBaseComponent from "./factory/base"
import createExtendedComponent, { createExtendedVariantsComponent } from "./factory/extend"
import createVariantsComponent from "./factory/variants"
import type {
  InputComponent,
  Interpolation,
  LogicHandler,
  MergeProps,
  RcBaseComponent,
  RcComponentFactory,
  VariantsConfig,
} from "./types"
import { domElements } from "./util/domElements"

/**
 * Intercepts property lookups:
 * - `rc.extend`: returns function to extend an existing component
 * - `rc.button`, `rc.div`, etc.: returns factory for base components, with `.variants`
 */
type InferComponentProps<Component> = Component extends RcBaseComponent<infer P> ? P : object

const createExtendBuilder = (
  baseComponent: RcBaseComponent<any>,
  logicHandlers: LogicHandler<any>[] = [],
) => {
  const builder = <T extends object>(strings: TemplateStringsArray, ...interpolations: Interpolation<T>[]) =>
    createExtendedComponent<T>(baseComponent, strings, interpolations, logicHandlers as LogicHandler<T>[])

  const builderWithLogic = builder as typeof builder & {
    logic: (handler: LogicHandler<any>) => ReturnType<typeof createExtendBuilder>
    variants: <ExtraProps extends object, VariantProps extends object = ExtraProps>(
      config: VariantsConfig<VariantProps, ExtraProps>,
    ) => RcBaseComponent<MergeProps<typeof baseComponent, ExtraProps & Partial<VariantProps>>>
  }

  builderWithLogic.logic = (handler: LogicHandler<any>) =>
    createExtendBuilder(baseComponent, [...logicHandlers, handler])

  builderWithLogic.variants = <ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ) =>
    createExtendedVariantsComponent<
      InferComponentProps<typeof baseComponent>,
      ExtraProps,
      VariantProps,
      MergeProps<typeof baseComponent, ExtraProps & Partial<VariantProps>>
    >(
      baseComponent,
      config,
      logicHandlers as LogicHandler<MergeProps<typeof baseComponent, ExtraProps & Partial<VariantProps>>>[],
    )

  return builderWithLogic
}

const createFactoryFunction = (tag: keyof JSX.IntrinsicElements, logicHandlers: LogicHandler<any>[] = []) => {
  const factory = <T extends object>(strings: TemplateStringsArray, ...interpolations: Interpolation<T>[]) =>
    createBaseComponent<T, keyof JSX.IntrinsicElements>(tag, strings, interpolations, {
      logic: logicHandlers as LogicHandler<any>[],
    })

  const factoryWithLogic = factory as typeof factory & {
    logic: (handler: LogicHandler<any>) => ReturnType<typeof createFactoryFunction>
    variants: <ExtraProps extends object, VariantProps extends object = ExtraProps>(
      config: VariantsConfig<VariantProps, ExtraProps>,
    ) => RcBaseComponent<any>
  }

  factoryWithLogic.logic = (handler: LogicHandler<any>) =>
    createFactoryFunction(tag, [...logicHandlers, handler])

  factoryWithLogic.variants = <ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ) =>
    createVariantsComponent<keyof JSX.IntrinsicElements, ExtraProps, VariantProps>(tag, config, {
      logic: logicHandlers as LogicHandler<any>[],
    })

  return factoryWithLogic
}

const cmTarget = Object.create(null) as RcComponentFactory

for (const tag of domElements) {
  cmTarget[tag] = createFactoryFunction(tag as keyof JSX.IntrinsicElements)
}

cmTarget.extend = <BCProps extends object>(baseComponent: RcBaseComponent<BCProps> | InputComponent) =>
  createExtendBuilder(baseComponent as RcBaseComponent<any>)

const cm = cmTarget

export default cm
