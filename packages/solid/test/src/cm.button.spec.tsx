/** @jsxImportSource solid-js */
import { render } from "@solidjs/testing-library"
import type { JSX } from "solid-js"

import cm, { type VariantsConfig, convertCmProps } from "../../src"

type ButtonElementProps = JSX.HTMLAttributes<HTMLButtonElement> & JSX.HTMLAttributes<HTMLAnchorElement>

interface ButtonBaseProps extends ButtonElementProps {
  $size?: "sm" | "md" | "lg"
  $color?: "primary" | "secondary" | "error" | "success" | "warning" | "card"
  $disabled?: boolean
  $loading?: boolean
  $noShadow?: boolean
  $noGutter?: boolean
}

const buttonVariants: VariantsConfig<ButtonBaseProps, object> = {
  base: (p) => `
    transition-colors
    inline-flex items-center justify-center gap-2
    font-bold
    text-lightNeutral
    shadow-darkNeutral/20
    ${p.$noShadow ? "!shadow-none" : ""}
    ${p.$noGutter ? "!p-0" : ""}
    ${p.$disabled ? "opacity-70 cursor-not-allowed" : ""}
    ${p.$loading ? "opacity-80 pointer-events-none" : ""}
  `,
  variants: {
    $size: {
      sm: "py-2 px-3 rounded text-sm shadow-sm",
      md: "py-2 px-3 rounded shadow-sm",
      lg: "py-3 px-4 rounded-lg shadow-md",
    },
    $color: {
      primary: ({ $disabled }) => `bg-primaryDarkNeutral ${!$disabled ? "hover:bg-primary" : ""}`,
      card: ({ $disabled }) => `
        bg-light
        !text-dark
        active:bg-successDarkNeutral
        ${
          !$disabled
            ? `
            hover:!text-dark
            hover:bg-gray/10
          `
            : ""
        }`,
      success: ({ $disabled }) => `bg-successDarkNeutral ${!$disabled ? "hover:bg-success" : ""}`,
      warning: ({ $disabled }) => `bg-warningDarkNeutral ${!$disabled ? "hover:bg-warning" : ""}`,
      error: ({ $disabled }) => `bg-errorDarkNeutral ${!$disabled ? "hover:bg-error" : ""}`,
    },
  },
  defaultVariants: {
    $size: "md",
    $color: "primary",
  },
}

const ButtonBase = cm.button.variants(buttonVariants)
const LinkButton = cm.a.variants(buttonVariants)

interface ButtonProps extends ButtonElementProps {
  icon?: JSX.Element
  link?: string
  type: "button" | "submit" | "reset"
  size?: ButtonBaseProps["$size"]
  color?: ButtonBaseProps["$color"]
  disabled?: ButtonBaseProps["$disabled"]
  loading?: ButtonBaseProps["$loading"]
  noShadow?: ButtonBaseProps["$noShadow"]
  noGutter?: ButtonBaseProps["$noGutter"]
}

const Button = ({ children, icon, link, ...buttonProps }: ButtonProps) => {
  const Component = link ? LinkButton : ButtonBase

  const preparedProps = convertCmProps(buttonProps, {
    size: "$size",
    noShadow: "$noShadow",
    noGutter: "$noGutter",
    loading: "$loading",
    disabled: "$disabled",
    color: "$color",
  })

  return (
    <Component {...(link ? { href: link } : {})} {...preparedProps}>
      {icon}
      {children}
    </Component>
  )
}

const CustomButton = cm.extend(Button)`
  w-7
  lg:w-8
  h-7
  lg:h-8
`

describe("cm advanced button (solid)", () => {
  it("extends the base component with new props", () => {
    const { container } = render(() => (
      <CustomButton type="button" aria-label="test" color="card" noGutter noShadow size="lg">
        Custom
      </CustomButton>
    ))

    expect(container.firstChild).toHaveClass(
      "transition-colors inline-flex items-center justify-center gap-2 font-bold text-lightNeutral",
    )
    expect(container.firstChild).toHaveClass("!shadow-none")
    expect(container.firstChild).toHaveClass("!p-0")
    expect(container.firstChild).toHaveAttribute("aria-label", "test")
  })
})
