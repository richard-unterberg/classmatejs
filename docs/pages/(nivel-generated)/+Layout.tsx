import { DocsRouteLayout } from "@unterberg/nivel/client"
import type { ReactNode } from "react"

const Layout = ({ children }: { children: ReactNode }) => {
  return <DocsRouteLayout>{children}</DocsRouteLayout>
}

export default Layout
