import cm from "@classmatejs/react"
import { LayoutComponent } from "@unterberg/nivel"
import ClassmateCode from "./Compare/classmate.mdx"
import CTAButtons from "./CTA"

interface AlertProps {
  $severity?: "info" | "warning" | "error"
  $isActive?: boolean
}

const Alert = cm.div.variants<AlertProps>({
  base: ({ $isActive }) => `
    ${$isActive ? "custom-class-active" : "custom-class-inactive"}
    p-4
    rounded-md
  `,
  variants: {
    $severity: {
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-600/50 dark:text-yellow-200",
      info: "bg-blue-100 text-blue-800 dark:bg-blue-600/50 dark:text-blue-200",
      error: "bg-red-100 text-red-800 dark:bg-red-600/50 dark:text-red-200",
    },
    $isActive: {
      true: ({ style }) =>
        style({
          border: "1px solid color-mix(in oklab, currentColor 18%, transparent)",
          boxShadow: "0 14px 40px color-mix(in oklab, currentColor 18%, transparent)",
        }),
      false: "border-gray-300 shadow-sm",
    },
  },
  defaultVariants: {
    $severity: "info",
    $isActive: false,
  },
})

const LocalAlert = cm.extend(Alert)`flex items-center justify-center text-sm text-center flex-1 text-xs`

const Page = () => {
  return (
    <div className="landing-code-samples">
      <div
        data-beasties-container
        className="overflow-x-clip min-h-[calc(100svh-14*var(--spacing))] flex flex-col justify-center py-16 w-full"
      >
        <div className="w-full overflow-x-hidden h-full max-w-full absolute top-0 left-0">
          <div className="absolute top-0 min-w-300 left-1/2 w-full h-svh bg-radial-[at_50%_50%] from-primary-muted-light/30 dark:from-primary-muted-light/30 to-55% translate-x-[-50%] pointer-events-none" />
        </div>

        <LayoutComponent className="relative">
          <div className="text-center mx-auto z-2 relative">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl! font-bold tracking-tight">
                @classmatejs
              </h1>
              <p className="font-normal text-base-muted text-lg md:text-2xl lg:text-3xl mt-4">
                Styled components for class names. For React and SolidJS.
              </p>
            </div>
          </div>
        </LayoutComponent>

        <LayoutComponent $size="lg" className="flex gap-2 justify-center">
          <CTAButtons />
        </LayoutComponent>
        <LayoutComponent>
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            <h2 className="text-lg mb-2 text-center">The Pain</h2>
            <h2 className="text-lg mb-2 text-center">The Aid</h2>
            <div className="flex  gap-4 p-3 border border-dashed border-base-muted rounded-md">
              example follows
            </div>
            <div className="flex  gap-4 p-3 border border-dashed border-base-muted rounded-md">
              <LocalAlert>
                <code>{`<Alert />`}</code>
              </LocalAlert>
              <LocalAlert $isActive>
                <code>{`<Alert $isActive />`}</code>
              </LocalAlert>
              <LocalAlert $severity="warning" $isActive>
                <code>{`<Alert  $severity="warning" $isActive />`}</code>
              </LocalAlert>
            </div>
          </div>
          <div className="landing-code-samples grid md:grid-cols-2 gap-4 md:items-stretch">
            <span className="md:hidden text-lg text-center font-semibold">Call in the browser</span>
            <ClassmateCode />
            <span className="md:hidden text-lg text-center  font-semibold">Run on the server</span>
            <ClassmateCode />
          </div>
        </LayoutComponent>
      </div>
    </div>
  )
}

export default Page
