import {
  createBaseComponent,
  createExtendedComponent,
  createExtendedVariantsComponent,
  createVariantsComponent,
  domElements,
} from "@classmatejs/core"
import type { JSX } from "react"

import type {
  CmBaseComponent,
  CmComponentFactory,
  CmFactoryFunction,
  CmIntrinsicElement,
  InputComponent,
  Interpolation,
  LogicHandler,
  MergeProps,
  VariantsConfig,
} from "./types"
import createReactElement from "./util/createReactElement"

type InferComponentProps<Component> = Component extends CmBaseComponent<infer P> ? P : object

const createExtendBuilder = (
  baseComponent: CmBaseComponent<any>,
  logicHandlers: LogicHandler<any>[] = [],
) => {
  type BaseInstance = typeof baseComponent
  type BaseProps = InferComponentProps<BaseInstance>
  type ExtendedProps<T extends object> = MergeProps<BaseInstance, T>

  const builder = <T extends object>(strings: TemplateStringsArray, ...interpolations: Interpolation<T>[]) =>
    createExtendedComponent<BaseProps, ExtendedProps<T>, keyof JSX.IntrinsicElements | InputComponent>(
      baseComponent,
      strings,
      interpolations,
      createReactElement,
      logicHandlers as LogicHandler<ExtendedProps<T>>[],
    ) as CmBaseComponent<ExtendedProps<T>>

  const builderWithLogic = builder as typeof builder & {
    logic: (handler: LogicHandler<any>) => ReturnType<typeof createExtendBuilder>
    variants: <ExtraProps extends object, VariantProps extends object = ExtraProps>(
      config: VariantsConfig<VariantProps, ExtraProps>,
    ) => CmBaseComponent<ExtendedProps<ExtraProps & Partial<VariantProps>>>
  }

  builderWithLogic.logic = (handler: LogicHandler<any>) =>
    createExtendBuilder(baseComponent, [...logicHandlers, handler])

  builderWithLogic.variants = <ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ) =>
    createExtendedVariantsComponent<
      keyof JSX.IntrinsicElements | InputComponent,
      BaseProps,
      ExtraProps,
      VariantProps,
      ExtendedProps<ExtraProps & Partial<VariantProps>>
    >(
      baseComponent,
      config,
      createReactElement,
      logicHandlers as LogicHandler<ExtendedProps<ExtraProps & Partial<VariantProps>>>[],
    ) as CmBaseComponent<ExtendedProps<ExtraProps & Partial<VariantProps>>>

  return builderWithLogic
}

const createFactoryFunction = <E extends CmIntrinsicElement>(
  tag: E,
  logicHandlers: LogicHandler<any>[] = [],
): CmFactoryFunction<E> => {
  const factory = <T extends object>(strings: TemplateStringsArray, ...interpolations: Interpolation<T>[]) =>
    createBaseComponent<MergeProps<E, T>, E>(tag, strings, interpolations, createReactElement, {
      logic: logicHandlers as LogicHandler<MergeProps<E, T>>[],
    }) as CmBaseComponent<MergeProps<E, T>>

  const factoryWithLogic = factory as CmFactoryFunction<E>

  factoryWithLogic.logic = ((handler: LogicHandler<any>) =>
    createFactoryFunction(tag, [...logicHandlers, handler])) as CmFactoryFunction<E>["logic"]

  factoryWithLogic.variants = (<ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ) =>
    createVariantsComponent<E, ExtraProps, VariantProps, MergeProps<E, ExtraProps & Partial<VariantProps>>>(
      tag,
      config,
      createReactElement,
      {
        logic: logicHandlers as LogicHandler<MergeProps<E, ExtraProps & Partial<VariantProps>>>[],
      },
    ) as CmBaseComponent<
      MergeProps<E, ExtraProps & Partial<VariantProps>>
    >) as CmFactoryFunction<E>["variants"]

  return factoryWithLogic
}

const cmTarget = Object.create(null) as Record<string, CmFactoryFunction<any>> & {
  extend?: CmComponentFactory["extend"]
}

for (const tag of domElements) {
  if (!cmTarget[tag]) {
    cmTarget[tag] = createFactoryFunction(tag as CmIntrinsicElement)
  }
}

cmTarget.extend = <BCProps extends object>(baseComponent: CmBaseComponent<BCProps> | InputComponent) =>
  createExtendBuilder(baseComponent as CmBaseComponent<any>)

const cm = cmTarget as unknown as CmComponentFactory

export default cm
