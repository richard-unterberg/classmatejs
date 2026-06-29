export const normalizePathname = (value: string) => {
  const pathname = value.split("?")[0]?.split("#")[0] ?? value
  const normalized = `/${pathname}`.replace(/\/+/g, "/").replace(/\/+$/g, "")

  return normalized === "" ? "/" : `${normalized}/`
}

export const withBasePath = (href: string, basePath: string) => {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return href
  }

  const normalizedHref = normalizePathname(href)
  const normalizedBasePath = normalizePathname(basePath)

  if (normalizedBasePath === "/") {
    return normalizedHref
  }

  if (normalizedHref === normalizedBasePath || normalizedHref.startsWith(normalizedBasePath)) {
    return normalizedHref
  }

  return `${normalizedBasePath.replace(/\/$/g, "")}${normalizedHref}`
}
