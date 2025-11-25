import {
  createBaseComponent,
  createExtendedComponent,
  createExtendedVariantsComponent,
  createVariantsComponent,
} from "@classmatejs/core"

import type { Interpolation } from "@classmatejs/core"
import type {
  CfBaseComponent,
  CmFactory,
  ExtendBuilder,
  MergeProps,
  VariantsConfig,
  WithClassNameProps,
} from "./types"
import createClassProcessor from "./util/createClassProcessor"

const CM_TAG = "cm"

const createExtendBuilder = <Base extends CfBaseComponent<any>>(baseComponent: Base): ExtendBuilder<Base> => {
  const builder = <T extends object>(
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<MergeProps<Base, T>>[]
  ) =>
    createExtendedComponent<MergeProps<Base, T>, string>(
      baseComponent,
      strings,
      interpolations,
      createClassProcessor,
    ) as CfBaseComponent<MergeProps<Base, T>>

  const builderWithVariants = builder as ExtendBuilder<Base>

  builderWithVariants.variants = <ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ) =>
    createExtendedVariantsComponent<
      string,
      ExtraProps,
      VariantProps,
      MergeProps<Base, ExtraProps & Partial<VariantProps>>
    >(baseComponent, config, createClassProcessor) as CfBaseComponent<
      MergeProps<Base, ExtraProps & Partial<VariantProps>>
    >

  return builderWithVariants
}

const createFactory = (): CmFactory => {
  const factory = (<T extends object>(
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<WithClassNameProps<T>>[]
  ) =>
    createBaseComponent<WithClassNameProps<T>, string>(
      CM_TAG,
      strings,
      interpolations,
      createClassProcessor,
    )) as CmFactory

  factory.variants = <ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ) =>
    createVariantsComponent<
      string,
      ExtraProps,
      VariantProps,
      WithClassNameProps<ExtraProps & Partial<VariantProps>>
    >(CM_TAG, config, createClassProcessor) as CfBaseComponent<
      WithClassNameProps<ExtraProps & Partial<VariantProps>>
    >

  factory.extend = <Base extends CfBaseComponent<any>>(component: Base) => createExtendBuilder(component)

  return factory
}

const cm = createFactory()

export default cm
