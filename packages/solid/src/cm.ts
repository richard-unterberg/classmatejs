import type { JSX } from "solid-js"

import createBaseComponent from "./factory/base"
import createExtendedComponent, { createExtendedVariantsComponent } from "./factory/extend"
import createVariantsComponent from "./factory/variants"
import type {
  InputComponent,
  Interpolation,
  LogicHandler,
  MergeProps,
  ScBaseComponent,
  ScComponentFactory,
  VariantsConfig,
} from "./types"
import { domElements } from "./util/domElements"

// init
type InferComponentProps<Component> = Component extends ScBaseComponent<infer P> ? P : object

const createExtendBuilder = (
  baseComponent: ScBaseComponent<any>,
  logicHandlers: LogicHandler<any>[] = [],
) => {
  const builder = <T extends object>(strings: TemplateStringsArray, ...interpolations: Interpolation<T>[]) =>
    createExtendedComponent<T>(baseComponent, strings, interpolations, logicHandlers as LogicHandler<T>[])

  const builderWithLogic = builder as typeof builder & {
    logic: (handler: LogicHandler<any>) => ReturnType<typeof createExtendBuilder>
    variants: <ExtraProps extends object, VariantProps extends object = ExtraProps>(
      config: VariantsConfig<VariantProps, ExtraProps>,
    ) => ScBaseComponent<MergeProps<typeof baseComponent, ExtraProps & Partial<VariantProps>>>
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
    ) => ScBaseComponent<any>
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

const cmTarget = Object.create(null) as ScComponentFactory

for (const tag of domElements) {
  cmTarget[tag as CmIntrinsicElement] = createFactoryFunction(tag as CmIntrinsicElement)
}

cmTarget.extend = <BCProps extends object>(baseComponent: ScBaseComponent<BCProps> | InputComponent) =>
  createExtendBuilder(baseComponent as ScBaseComponent<any>)

const cm = cmTarget

export default cm
