export const getProductPath = (product: {
  slug?: string | null
  id?: string | number | null
}) => {
  if (product.slug) {
    return `/product/${product.slug}`
  }

  return `/product/${product.id ?? ''}`
}

export const getProductPathFromPermalink = (
  permalink?: string | null,
  fallbackId?: string | number | null
) => {
  if (permalink) {
    try {
      const url = new URL(permalink)
      const segments = url.pathname.split('/').filter(Boolean)
      const slug = segments[segments.length - 1]

      if (slug) {
        return getProductPath({ slug })
      }
    } catch {
      // Ignore invalid permalink and fallback to id below.
    }
  }

  return getProductPath({ id: fallbackId ?? '' })
}
