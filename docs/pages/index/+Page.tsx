import cm from '@classmatejs/react'
import { LayoutComponent } from '@unterberg/nivel'
import CodePresenter from '../../components/CodePresenter'
import ClassmateCode from './Compare/classmate.mdx'
import CVACode from './Compare/cva.mdx'
import NativeCode from './Compare/native.mdx'
import CTAButtons from './CTA'

import './startpage.css'

interface AlertProps {
  $severity?: 'info' | 'warning' | 'error'
  $isActive?: boolean
}

const Alert = cm.div.variants<AlertProps>({
  base: ({ $isActive }) => `
    ${$isActive ? 'custom-class-active' : 'custom-class-inactive'}
    p-4
    rounded-md
  `,
  variants: {
    $severity: {
      warning: 'bg-warning/20 text-warning',
      info: 'bg-info/20 text-info',
      error: 'bg-error/20 text-error',
    },
    $isActive: {
      true: 'border border-current/50 shadow-xl shadow-current/20',
      false: 'border border-current/20 border-dashed',
    },
  },
  defaultVariants: {
    $severity: 'info',
    $isActive: false,
  },
})

const LocalAlert = cm.extend(Alert)`flex items-center justify-center text-sm text-center flex-1 text-xs`

const Page = () => {
  return (
    <div className="landing-code-samples">
      <div
        data-beasties-container
        className="overflow-x-clip min-h-[calc(100svh-14*var(--spacing))] flex flex-col justify-center w-full"
      >
        <div className="absolute top-0 left-0 right-0 h-[50svh] z-0 -translate-y-16">
          <img src="/bg-dark.png" alt="" className="hidden dark:block absolute w-full h-full object-fill" />
          <img src="/bg-light.png" alt="" className="dark:hidden absolute w-full h-full object-fill" />
        </div>
        <div className="mt-24 mb-16">
          <LayoutComponent className="relative">
            <div className="text-center mx-auto z-2 relative">
              <div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight">@classmatejs</h1>
                <p className="font-normal text-base-muted text-lg md:text-2xl lg:text-3xl mt-4">
                  Styled components for class names. For React and SolidJS.
                </p>
              </div>
            </div>
          </LayoutComponent>
          <LayoutComponent $size="sm" className="flex gap-2 justify-center">
            <CTAButtons />
          </LayoutComponent>
        </div>
        <LayoutComponent className="mt-0">
          <CodePresenter
            leftCode={<NativeCode />}
            leftCodeLabel="Native"
            rightCode={<CVACode />}
            rightCodeLabel="CVA"
            highlightCode={<ClassmateCode />}
            highlightCodeLabel="Classmate"
            hightlightBoxHeight={660}
            smallBoxHeight={560}
          />
        </LayoutComponent>
        <LayoutComponent $size="lg" className="flex gap-2 justify-center mt-10">
          <LocalAlert>
            <code>{`<Alert />`}</code>
          </LocalAlert>
          <LocalAlert $isActive>
            <code>{`<Alert $isActive />`}</code>
          </LocalAlert>
          <LocalAlert $severity="warning">
            <code>{`<Alert $severity="warning" />`}</code>
          </LocalAlert>
          <LocalAlert $severity="warning" $isActive>
            <code>{`<Alert $severity="warning" $isActive />`}</code>
          </LocalAlert>
          <LocalAlert $severity="error">
            <code>{`<Alert $severity="error" />`}</code>
          </LocalAlert>
          <LocalAlert $severity="error" $isActive>
            <code>{`<Alert $severity="error" $isActive />`}</code>
          </LocalAlert>
        </LayoutComponent>

        <LayoutComponent $size="xs" className="">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">Explore Variants</h1>
          <p>
            Classmate is a utility-first library that allows you to create styled components with variants. It provides
            a simple and intuitive API for defining and using variants in your components.
          </p>
        </LayoutComponent>

        <LayoutComponent $size="full" className="mt-0">
          <CodePresenter
            leftCode={<NativeCode />}
            leftCodeLabel="Native"
            rightCode={<CVACode />}
            rightCodeLabel="CVA"
            highlightCode={<ClassmateCode />}
            highlightCodeLabel="Classmate"
            hightlightBoxHeight={660}
            smallBoxHeight={560}
          />
        </LayoutComponent>

        <LayoutComponent $size="lg" className="flex gap-2 justify-center mt-10">
          <CTAButtons />
        </LayoutComponent>
      </div>
    </div>
  )
}

export default Page
