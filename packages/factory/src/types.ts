import type { Interpolation, RuntimeComponent, VariantsConfig } from "@classmatejs/core"

export type { Interpolation, VariantsConfig } from "@classmatejs/core"

export interface ClassNameProps {
  class?: string
  className?: string
}

export type WithClassNameProps<P extends object> = Omit<P, "class" | "className"> & ClassNameProps

export interface CfBaseComponent<P extends object = object> extends RuntimeComponent<P> {
  (props?: P): string
}

type BaseProps<C> = C extends CfBaseComponent<infer P> ? P : object

export type MergeProps<Base, Extra extends object> = WithClassNameProps<BaseProps<Base> & Extra>

export interface ExtendBuilder<Base extends CfBaseComponent<any>> {
  <T extends object>(
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<MergeProps<Base, T>>[]
  ): CfBaseComponent<MergeProps<Base, T>>
  variants<ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ): CfBaseComponent<MergeProps<Base, ExtraProps & Partial<VariantProps>>>
}

export interface CmFactory {
  <T extends object>(
    strings: TemplateStringsArray,
    ...interpolations: Interpolation<WithClassNameProps<T>>[]
  ): CfBaseComponent<WithClassNameProps<T>>
  variants<ExtraProps extends object, VariantProps extends object = ExtraProps>(
    config: VariantsConfig<VariantProps, ExtraProps>,
  ): CfBaseComponent<WithClassNameProps<ExtraProps & Partial<VariantProps>>>
  extend<Base extends CfBaseComponent<any>>(component: Base): ExtendBuilder<Base>
}
