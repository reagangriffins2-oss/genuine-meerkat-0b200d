// Serve generated artwork through the Netlify Image CDN instead of shipping full-size PNGs.
export function cdnImage(src: string, width: number) {
  const url = src.startsWith('/') ? src : `/${src}`
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=${width}&fm=webp&q=80`
}
