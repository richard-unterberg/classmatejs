import { MetaHead, useDocsContext } from "@unterberg/nivel/client"
import { withBasePath } from "../util/withBasePath"

export const Head = () => {
  const docs = useDocsContext()

  return (
    <>
      <link rel="icon" href={withBasePath("/favicon.ico", docs.basePath)} />
      <link rel="apple-touch-icon" href={withBasePath("/apple-touch-icon.png", docs.basePath)} />
      <link rel="manifest" href={withBasePath("/site.webmanifest", docs.basePath)} />
      <MetaHead />
    </>
  )
}
