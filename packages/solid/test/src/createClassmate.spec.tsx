/** @jsxImportSource solid-js */
import { render, screen } from "@solidjs/testing-library"

import cm, { createClassmate } from "../../src"

describe("createClassmate helper (solid)", () => {
  it("evaluates the factory only once per invocation", () => {
    let executions = 0

    const RenderComponent = () => {
      const StyledDay = createClassmate(() => {
        executions += 1
        return cm.div`
          p-2
          text-sm
        `
      })

      return (
        <StyledDay data-testid="styled-day" $status="pending">
          Test
        </StyledDay>
      )
    }

    render(() => <RenderComponent />)
    expect(screen.getByTestId("styled-day")).toHaveClass("p-2 text-sm")
    expect(executions).toBe(1)
  })

  it("returns independent component factories for separate calls", () => {
    const references: Array<ReturnType<typeof createClassmate>> = []

    const RenderComponent = ({ id }: { id: string }) => {
      const StyledCard = createClassmate(
        () =>
          cm.div`
          p-4 border
        `,
      )
      references.push(StyledCard)

      return <StyledCard data-testid={`styled-card-${id}`}>Card {id}</StyledCard>
    }

    render(() => (
      <>
        <RenderComponent id="a" />
        <RenderComponent id="b" />
      </>
    ))

    expect(screen.getByTestId("styled-card-a")).toHaveClass("p-4 border")
    expect(screen.getByTestId("styled-card-b")).toHaveClass("p-4 border")
    expect(references).toHaveLength(2)
    expect(references[0]).not.toBe(references[1])
  })
})
