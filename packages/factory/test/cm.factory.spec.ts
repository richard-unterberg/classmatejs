import { describe, expect, it } from "vitest"

import cm from "../src"

describe("@classmatejs/factory", () => {
  it("computes classes for base components", () => {
    const Div = cm<{ $active?: boolean }>`
      p-4
      ${(p) => (p.$active ? "text-blue" : "text-gray")}
    `

    expect(Div({ $active: true })).toBe("p-4 text-blue")
    expect(Div({ $active: false })).toBe("p-4 text-gray")
  })

  it("merges incoming className values via tailwind-merge", () => {
    const Div = cm`mt-2 mt-8 mt-1`

    expect(Div()).toBe("mt-1")
    expect(Div({ className: "mt-4" })).toBe("mt-4")
  })

  it("allows extending existing processors", () => {
    const Base = cm`p-2 rounded`
    const Extended = cm.extend(Base)<{ $variant?: "primary" | "ghost" }>`
      ${(p) => (p.$variant === "ghost" ? "bg-transparent text-blue-500" : "bg-blue-600 text-white")}
    `

    expect(Extended({ $variant: "primary" })).toBe("p-2 rounded bg-blue-600 text-white")
    expect(Extended({ $variant: "ghost" })).toBe("p-2 rounded bg-transparent text-blue-500")
  })

  it("computes variants similar to tailwind-variants", () => {
    interface ButtonProps {
      $disabled?: boolean
    }

    interface ButtonVariants {
      $size: "sm" | "lg"
    }

    const Button = cm.variants<ButtonProps, ButtonVariants>({
      base: (p) => `inline-flex font-medium ${p.$disabled ? "opacity-60 cursor-not-allowed" : ""}`,
      variants: {
        $size: {
          sm: "text-sm px-2 py-1",
          lg: "text-lg px-4 py-2",
        },
      },
      defaultVariants: {
        $size: "sm",
      },
    })

    expect(Button({ $disabled: false })).toBe("inline-flex font-medium text-sm px-2 py-1")
    expect(Button({ $size: "lg", $disabled: true })).toBe(
      "inline-flex font-medium opacity-60 cursor-not-allowed text-lg px-4 py-2",
    )
  })

  it("extends variant processors without re-defining the config", () => {
    interface AlertProps {
      $tone: "info" | "warning"
    }

    const Alert = cm.variants<AlertProps>({
      base: "p-4 rounded",
      variants: {
        $tone: {
          info: "bg-blue-500 text-white",
          warning: "bg-yellow-500 text-black",
        },
      },
    })

    const AlertWithIcon = cm.extend(Alert)<{ $withIcon?: boolean }>`
      ${(p) => (p.$withIcon ? "pl-10" : "")}
    `

    expect(AlertWithIcon({ $tone: "warning", $withIcon: true })).toBe(
      "p-4 rounded bg-yellow-500 text-black pl-10",
    )
  })
})
