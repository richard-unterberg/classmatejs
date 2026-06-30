import cm from '@classmatejs/react'
import type { JSX } from 'react'

const SmallBox = cm.div`
  small-text 
  col-span-3 relative z-1 
  pointer-events-none
`

const SmallBoxGradient = cm.div<{ $dir?: 'left' | 'right' }>`
  ${({ $dir }) => ($dir === 'right' ? 'bg-linear-to-r' : 'bg-linear-to-l')}
  from-base-100/90
  hidden md:block 
  absolute top-13 left-0 right-0 w-full
  z-20 pointer-events-none
`

const BigBox = cm.div`
  col-span-6 md:-translate-y-10 md:h-170 relative z-20
`

const BigBoxShadow = cm.div`
  hidden md:block 
  absolute top-13 left-px right-px 
  bg-primary-muted-superlight
  shadow-2xl shadow-primary-muted rounded-2xl overflow-hidden
`

const bigBoxReducer = 24

interface CodePresenterProps {
  leftCode: JSX.Element
  leftCodeLabel: string
  rightCode: JSX.Element
  rightCodeLabel: string
  highlightCode: JSX.Element
  highlightCodeLabel: string
  smallBoxHeight: number
  hightlightBoxHeight: number
}

const CodePresenter = ({
  leftCode,
  leftCodeLabel,
  rightCode,
  rightCodeLabel,
  highlightCode,
  highlightCodeLabel,
  smallBoxHeight = 150,
  hightlightBoxHeight = 170,
}: CodePresenterProps) => {
  return (
    <div className="landing-code-samples md:grid grid-cols-12 gap-4 mt-16">
      <SmallBox style={{ height: `${smallBoxHeight}px` }}>
        <SmallBoxGradient style={{ height: `${smallBoxHeight}px` }} $dir="left" />
        <h2 className="text-lg mb-2 text-center">{leftCodeLabel}</h2>
        {leftCode}
      </SmallBox>
      <BigBox style={{ height: `${hightlightBoxHeight}px` }}>
        <BigBoxShadow style={{ height: `${hightlightBoxHeight - bigBoxReducer}px` }} />
        <h2 className="text-lg mb-2 text-center">{highlightCodeLabel}</h2>
        <div className="h-full z-2">{highlightCode}</div>
      </BigBox>
      <SmallBox style={{ height: `${smallBoxHeight}px` }}>
        <SmallBoxGradient style={{ height: `${smallBoxHeight}px` }} $dir="right" />
        <h2 className="text-lg mb-2 text-center">{rightCodeLabel}</h2>
        {rightCode}
      </SmallBox>
    </div>
  )
}

export default CodePresenter
