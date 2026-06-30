import { AppLayout } from '@unterberg/nivel/client'
import type { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'

const Layout = ({ children }: { children: ReactNode }) => {
  const { urlParsed } = usePageContext()

  return (
    <div data-is-startpage={urlParsed.pathname === '/'}>
      <AppLayout>{children}</AppLayout>
    </div>
  )
}

export default Layout
