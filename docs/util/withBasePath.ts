export const normalizePathname = (value: string) => {
  const pathname = value.split('?')[0]?.split('#')[0] ?? value
  const normalized = `/${pathname}`.replace(/\/+/g, '/').replace(/\/+$/g, '')

  return normalized === '' ? '/' : `${normalized}/`
}

export const stripBasePath = (pathname: string, basePath: string) => {
  const normalizedPathname = normalizePathname(pathname)
  const normalizedBasePath = normalizePathname(basePath)

  if (normalizedBasePath === '/') {
    return normalizedPathname
  }

  if (normalizedPathname === normalizedBasePath) {
    return '/'
  }

  return normalizedPathname.startsWith(normalizedBasePath)
    ? `/${normalizedPathname.slice(normalizedBasePath.length)}`
    : normalizedPathname
}

export const withDocsBasePath = (href: string, basePath: string) => {
  if (!href.startsWith('/') || href.startsWith('//')) {
    return href
  }

  const normalizedHref = normalizePathname(href)
  const normalizedBasePath = normalizePathname(basePath)

  if (normalizedBasePath === '/') {
    return normalizedHref
  }

  if (normalizedHref === normalizedBasePath || normalizedHref.startsWith(normalizedBasePath)) {
    return normalizedHref
  }

  return `${normalizedBasePath.replace(/\/$/g, '')}${normalizedHref}`
}
