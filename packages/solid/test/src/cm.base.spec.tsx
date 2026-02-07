/** @jsxImportSource solid-js */
import { render } from "@solidjs/testing-library"
import type { JSX } from "solid-js"

import cm from "../../src"

describe("cm base (solid)", () => {
  it("renders a cm.div with assigned classes", () => {
    const RenderDiv = cm.div`bg-red p-4`

    const { container } = render(() => <RenderDiv />)
    expect(container.firstChild).toHaveClass("bg-red p-4")
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement)
  })

  it("filters $-prefixed props & renders the class attribute on a cm.button", () => {
    const HiddenButton = cm.button<{ $disabled: boolean }>`
      text-blue custom ${(p) => (p.$disabled ? "opacity-60" : "")}
    `
    const { container } = render(() => <HiddenButton aria-label="testlabel" $disabled />)

    expect(container.firstChild).not.toHaveAttribute("$disabled")
    expect(container.firstChild).toHaveClass("text-blue custom opacity-60")
    expect(container.firstChild).toHaveAttribute("aria-label")
    expect(container.firstChild).toBeInstanceOf(HTMLButtonElement)
  })

  it("allows boolean short-circuit in interpolations", () => {
    const LoadingDiv = cm.div<{ $isLoading?: boolean }>`
      base
      ${(p) => p.$isLoading && "opacity-90 pointer-events-none"}
    `

    const { container: loadingContainer } = render(() => <LoadingDiv $isLoading />)
    expect(loadingContainer.firstChild).toHaveClass("base opacity-90 pointer-events-none")

    const { container: idleContainer } = render(() => <LoadingDiv $isLoading={false} />)
    expect(idleContainer.firstChild).toHaveClass("base")
  })

  it("can use intrinsic properties of element", () => {
    const HiddenButton = cm.button<JSX.IntrinsicElements["button"]>`
      text-blue
      custom
      ${(p) => (p.type === "button" ? "opacity-60" : "")}
    `
    const { container } = render(() => <HiddenButton aria-label="testlabel" type="button" />)

    expect(container.firstChild).toHaveClass("text-blue custom opacity-60")
    expect(container.firstChild).toHaveAttribute("aria-label")
    expect(container.firstChild).toBeInstanceOf(HTMLButtonElement)
  })

  it("merges multiple classes using tailwind-merge", () => {
    const MergedDiv = cm.div`mt-2 mt-8 mt-1`

    const { container } = render(() => <MergedDiv />)

    expect(container.firstChild).toHaveClass("mt-1")
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement)
  })

  it("allows overwriting classes via incoming class attribute", () => {
    const MergedDiv = cm.div`mt-2 mt-8 mt-1`

    const { container } = render(() => <MergedDiv class="mt-10" />)

    expect(container.firstChild).toHaveClass("mt-10")
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement)
  })

  it("normalizes inline style objects passed to the component", () => {
    const StyledDiv = cm.div`bg-red`

    const { container } = render(() => <StyledDiv style={{ backgroundColor: "blue", fontSize: "14px" }} />)
    expect(container.firstChild).toHaveStyle("background-color: blue")
    expect(container.firstChild).toHaveStyle("font-size: 14px")
  })
})
