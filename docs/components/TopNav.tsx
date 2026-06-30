import cm from '@classmatejs/react'
import { useUniversalMdxRuntime } from '@unterberg/nivel'
import { useDocsContext } from '@unterberg/nivel/client'
import { useMemo } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { normalizePathname, stripBasePath, withDocsBasePath } from '../util/withBasePath'

type TopNavItem = {
  activePathPrefix: string
  fallbackHref: string
  label: string
  isCta?: boolean
  pageId: string
}

const topBarNav = [
  {
    pageId: 'get-started',
    fallbackHref: '/phase-1/overview/',
    activePathPrefix: '/phase-1/',
    label: 'Get started',
    isCta: true,
  },
  {
    pageId: 'extend',
    fallbackHref: '/phase-2/overview/',
    activePathPrefix: '/phase-2/',
    label: 'Extend',
  },
  {
    pageId: 'transform',
    fallbackHref: '/phase-3/overview/',
    activePathPrefix: '/phase-3/',
    label: 'Transform',
  },
  {
    pageId: 'advanced-integration',
    fallbackHref: '/phase-4/overview/',
    activePathPrefix: '/phase-4/',
    label: 'Advanced',
  },
] satisfies TopNavItem[]

const TopNav = () => {
  const docs = useDocsContext()
  const runtime = useUniversalMdxRuntime()
  const { urlPathname, is404 } = usePageContext()
  const pagesById = useMemo(() => new Map(docs.pages.map((page) => [page.id, page])), [docs.pages])
  const currentPathname = stripBasePath(urlPathname, docs.basePath)

  return (
    <StyledTopNav>
      {topBarNav.map(({ pageId, ...item }) => (
        <TopNavItem
          key={pageId}
          {...item}
          href={
            runtime?.localizeHref?.(pagesById.get(pageId)?.href ?? item.fallbackHref) ??
            withDocsBasePath(item.fallbackHref, docs.basePath)
          }
          isActive={
            !!(item.activePathPrefix && currentPathname.startsWith(normalizePathname(item.activePathPrefix)) && !is404)
          }
        />
      ))}
    </StyledTopNav>
  )
}

const TopNavItem = (
  item: Omit<TopNavItem, 'activePathPrefix' | 'fallbackHref' | 'pageId'> & { href: string; isActive: boolean },
) => {
  return (
    <StyleTopNavItem $isActive={item.isActive} $isCta={item.isCta} href={item.href}>
      {item.label}
    </StyleTopNavItem>
  )
}

export default TopNav

const StyledTopNav = cm.nav`
  flex items-center justify-center 
  w-full 
  gap-1.5 xl:gap-3
`

const StyleTopNavItem = cm.a<{ $isActive: boolean; $isCta?: boolean }>`
  btn btn-sm tracking-tight
  text-xs xl:text-sm 
  ${({ $isActive }) => $isActive && 'btn-primary'}
  ${({ $isCta }) => $isCta && 'btn-primary btn-outline'}
`
