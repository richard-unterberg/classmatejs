type PrefixedProps<T extends object, K extends PropertyKey> = {
  [Key in K as Key extends string ? `$${Key}` : never]: Key extends keyof T ? T[Key] : never
}

const convertRuntimeProps = <T extends object, BaseProps extends object, K extends keyof BaseProps & keyof T>(
  props: T,
  mappings: Record<K, `$${K & string}`>,
): Omit<T, K> & PrefixedProps<T, K> => {
  const convertedProps: Record<string, T[K]> = {}

  for (const key of Object.keys(mappings)) {
    if (key in props) {
      convertedProps[mappings[key as K]] = props[key as K]
      delete props[key as K]
    }
  }

  return { ...props, ...convertedProps } as Omit<T, K> & PrefixedProps<T, K>
}

export default convertRuntimeProps
