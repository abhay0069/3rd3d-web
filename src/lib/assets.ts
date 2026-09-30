/**
 * Resolve a file in Vite's public directory against the configured deployment
 * base. Public files referenced from React aren't rewritten by Vite, so a
 * root-relative `/img/...` path breaks on GitHub Pages project sites.
 */
export function publicAsset(path: string): string {
  const relativePath = path.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${relativePath}`
}
