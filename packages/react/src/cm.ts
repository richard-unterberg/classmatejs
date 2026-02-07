import createBaseComponent from "./factory/base"
import createExtendedComponent, { createExtendedVariantsComponent } from "./factory/extend"
import createVariantsComponent from "./factory/variants"
import type {
  CmBaseComponent,
  CmComponentFactory,
  CmFactoryFunction,
  InputComponent,
  Interpolation,
  LogicHandler,
  MergeProps,
  VariantsConfig,
} from "./types"
import { type AllowedTags, domElements } from "./util/domElements"

const createExtendBuilder = (
  baseComponent: CmBaseComponent<any>,
  logicHandlers: LogicHandler<any>[] = [],
) => {
  const builder = <T extends object>(strings: TemplateStringsArray, ...interpolations: Interpolation<T>[]) =>
    createExtendedComponent<T>(baseComponent, strings, interpolations, logicHandlers as LogicHandler<T>[])

  const builderWithLogic = builder as typeof builder & {
    logic: (handler: LogicHandler<any>) => ReturnType<typeof createExtendBuilder>
    variants: <ExtraProps extends object, VariantProps extends object = ExtraProps>(
      config: VariantsConfig<VariantProps, ExtraProps>,
    ) => CmBaseComponent<MergeProps<typeof baseComponent, ExtraProps & Partial<VariantProps>>>
  }

  builderWithLogic.logic = (handler: LogicHandler<any>) =>
    createExtendBuilder(baseComponent, [...logicHandlers, handler])

  builderWithLogic.variants = <ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ) =>
    createExtendedVariantsComponent<
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

const createFactoryFunction = <K extends AllowedTags>(
  tag: K,
  logicHandlers: LogicHandler<any>[] = [],
): CmFactoryFunction<K> => {
  const factory = (<T extends object>(strings: TemplateStringsArray, ...interpolations: Interpolation<T>[]) =>
    createBaseComponent<T, K>(tag, strings, interpolations, {
      logic: logicHandlers as LogicHandler<any>[],
    })) as CmFactoryFunction<K>

  factory.logic = <LogicProps extends object = object>(handler: LogicHandler<MergeProps<K, LogicProps>>) =>
    createFactoryFunction(tag, [...logicHandlers, handler])

  factory.variants = <ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ) =>
    createVariantsComponent<K, ExtraProps, VariantProps>(tag, config, {
      logic: logicHandlers as LogicHandler<any>[],
    })

  return factory
}

type CmFactoryMap = { [K in AllowedTags]: CmFactoryFunction<K> }
const cmTarget = Object.create(null) as CmFactoryMap & Pick<CmComponentFactory, "extend">

const registerFactory = <K extends AllowedTags>(tag: K) => {
  ;(cmTarget as Record<AllowedTags, unknown>)[tag] = createFactoryFunction(tag)
}

domElements.forEach(registerFactory)

cmTarget.extend = <BCProps extends object>(baseComponent: CmBaseComponent<BCProps> | InputComponent) =>
  createExtendBuilder(baseComponent as CmBaseComponent<any>)

const cm = cmTarget

export default cm
