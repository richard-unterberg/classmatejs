/** @jsxImportSource solid-js */
import { render } from "@solidjs/testing-library"
import type { JSX } from "solid-js"

import cm from "../../src"

describe("cm.extend (solid)", () => {
  it("extends the base component with new props", () => {
    interface StyledSliderItemBaseProps {
      $isActive: boolean
    }

    const StyledSliderItemBase = cm.button<StyledSliderItemBaseProps>`
      absolute
      top-0
      ${(p) => (p.$isActive ? "animate-in fade-in" : "animate-out fade-out")}
    `

    interface NewStyledSliderItemProps extends StyledSliderItemBaseProps {
      $secondBool: boolean
    }

    const NewStyledSliderItemWithNewProps = cm.extend(StyledSliderItemBase)<NewStyledSliderItemProps>`
      rounded-lg
      text-lg
      ${(p) => (p.$isActive ? "bg-blue" : "bg-red")}
      ${(p) => (p.type === "button" ? "text-underline" : "some-class-here")}
    `

    const { container } = render(() => (
      <NewStyledSliderItemWithNewProps type="button" $isActive={false} $secondBool>
        Test
      </NewStyledSliderItemWithNewProps>
    ))
    expect(container.firstChild).toHaveClass(
      "absolute top-0 animate-out fade-out rounded-lg text-lg bg-red text-underline",
    )
    expect(container.firstChild).not.toHaveAttribute("$isActive")
    expect(container.firstChild).not.toHaveAttribute("$secondBool")
    expect(container.firstChild).toBeInstanceOf(HTMLButtonElement)
  })

  it("assigns an intrinsic cm component and infers base props", () => {
    const StyledButton = cm.extend(cm.button``)<{ $trigger?: boolean }>`
      bg-white
      ${(p) => (p.type === "button" ? "border-primary" : "")}
    `

    const { container } = render(() => <StyledButton type="button" />)
    expect(container.firstChild).toHaveClass("bg-white border-primary")
  })

  it("extends a Solid component with assigned class", () => {
    const MyInput = (props: JSX.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />

    const StyledInput = cm.extend(MyInput)<{ $trigger?: boolean }>`
      bg-white
      border-1
      ${(p) => (p.$trigger ? "border-error" : "border-gray")}
    `

    const { container } = render(() => <StyledInput type="text" $trigger />)
    expect(container.firstChild).toHaveClass("bg-white border-error")
    expect(container.firstChild).toBeInstanceOf(HTMLInputElement)
    expect(container.firstChild).not.toHaveAttribute("$trigger")
    expect(container.firstChild).toHaveAttribute("type", "text")
  })

  it("extends an already extended component", () => {
    const MyInput = (props: JSX.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />

    const StyledInput = cm.extend(MyInput)<{ $trigger?: boolean }>`
      bg-white
      border-1
      ${(p) => (p.$trigger ? "border-error" : "border-gray")}
    `

    const ExtendedStyledInput = cm.extend(StyledInput)<{ $someBool?: boolean }>`
      custom-class
      ${(p) => (p.$someBool ? "shadow" : "")}
      ${(p) => (p.type === "text" ? "text-lg" : "")}
      ${(p) => (p.$trigger ? "text-red" : "")}
    `

    const { container } = render(() => <ExtendedStyledInput type="text" $trigger $someBool />)
    expect(container.firstChild).toHaveClass("bg-white border-1 border-error custom-class")
    expect(container.firstChild).toHaveClass("shadow")
    expect(container.firstChild).toHaveClass("text-lg")
    expect(container.firstChild).toHaveClass("text-red")
    expect(container.firstChild).toBeInstanceOf(HTMLInputElement)
    expect(container.firstChild).not.toHaveAttribute("$trigger")
    expect(container.firstChild).not.toHaveAttribute("$someBool")
  })

  it("extends a variants component", () => {
    interface StyledSliderItemBaseProps {
      $isActive: boolean
      $color?: "red" | "blue"
    }

    const StyledSliderItemBase = cm.div.variants<StyledSliderItemBaseProps>({
      base: ({ $isActive }) => `absolute top-0 ${$isActive ? "animate-in fade-in" : "animate-out fade-out"}`,
      variants: {
        $color: {
          red: ({ $isActive }) => `${$isActive ? "bg-red" : "bg-red/50"} `,
          blue: ({ $isActive }) => `${$isActive ? "bg-blue" : "bg-blue/50"} `,
        },
      },
      defaultVariants: {
        $color: "red",
      },
    })

    const Extended = cm.extend(StyledSliderItemBase)`
      rounded-lg
      text-lg
      ${({ $isActive }) => ($isActive ? "pointer-events-none" : "")}
    `

    const { container: inactiveElement } = render(() => <Extended $isActive />)
    const { container: activeElement } = render(() => <Extended $isActive={false} />)

    expect(inactiveElement.firstChild).toHaveClass(
      "absolute top-0 animate-in fade-in bg-red rounded-lg text-lg pointer-events-none",
    )
    expect(activeElement.firstChild).toHaveClass(
      "absolute top-0 animate-out fade-out bg-red/50 rounded-lg text-lg",
    )
  })

  it("creates variant configs when extending components", () => {
    interface ButtonProps {
      $isLoading?: boolean
    }

    const BaseButton = cm.button<ButtonProps>`
      font-semibold
      ${(p) => (p.$isLoading ? "opacity-40" : "opacity-100")}
    `

    interface VariantExtras extends ButtonProps {
      $tone?: "muted" | "loud"
    }

    type VariantConfigProps = VariantExtras & JSX.ButtonHTMLAttributes<HTMLButtonElement>

    const ExtendedWithVariants = cm.extend(BaseButton).variants<VariantConfigProps, { $size: "sm" | "lg" }>({
      base: ({ $tone, $isLoading }) => `
        ${$tone === "muted" ? "text-slate-500" : "text-slate-900"}
        ${$isLoading ? "pointer-events-none" : ""}
      `,
      variants: {
        $size: {
          sm: "text-sm px-2 py-1",
          lg: ({ $isLoading }) => `text-lg px-4 py-2 ${$isLoading ? "cursor-wait" : ""}`,
        },
      },
      defaultVariants: {
        $size: "sm",
      },
    })

    const initialRender = render(() => (
      <ExtendedWithVariants type="button" $isLoading $tone="muted" $size="lg">
        Save
      </ExtendedWithVariants>
    ))

    expect(initialRender.container.firstChild).toHaveClass(
      "font-semibold opacity-40 text-slate-500 pointer-events-none text-lg px-4 py-2 cursor-wait",
    )
    expect(initialRender.container.firstChild).toHaveAttribute("type", "button")
    expect(initialRender.container.firstChild).not.toHaveAttribute("$size")

    initialRender.unmount()

    const secondRender = render(() => (
      <ExtendedWithVariants type="button" $tone="loud">
        Save
      </ExtendedWithVariants>
    ))

    expect(secondRender.container.firstChild).toHaveClass(
      "font-semibold opacity-100 text-slate-900 text-sm px-2 py-1",
    )
  })
})
