/**
 * Prefixes public assets with Vite's configured base path. This keeps absolute
 * public URLs correct both at `/` (Vercel/local) and project-site paths such as
 * `/3rd3d-web/` (GitHub Pages).
 */
export function assetUrl(path: string) {
  const relative = path.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${relative}`
}
