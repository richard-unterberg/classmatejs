/**
 * Converts props to their `$`-prepended counterparts and removes the original keys.
 * Mainly used if you wanna "mirror" properties from a component to a classmate component.
 *
 * @param props - The original props object.
 * @param mappings - An object mapping original keys (from BaseProps) to `$`-prepended keys.
 * @returns A new object with `$`-prepended keys and original keys removed.
 * @example
 * ```tsx
 * const preparedProps = convertCmProps(buttonProps, {
 *  size: "$size",
 *  noShadow: "$noShadow",
 *  noGutter: "$noGutter",
 *  loading: "$loading",
 *  disabled: "$disabled",
 *  color: "$color",
 * })
 * ```
 * will result in (example):
 * ```tsx
 * const preparedProps = {
 *  $size: "md",
 *  $color: "primary",
 *  $disabled: false,
 *  $loading: false,
 *  $noShadow: false,
 *  $noGutter: false,
 * }
 */
export { convertRuntimeProps as default } from "@classmatejs/core"
