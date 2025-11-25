import type { CmBaseComponent } from "./types"

const createClassmate = <Props extends object>(
  factory: () => CmBaseComponent<Props>,
): CmBaseComponent<Props> => {
  return factory()
}

export default createClassmate
