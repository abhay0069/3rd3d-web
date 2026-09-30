import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const sourceRoot = path.join(root, 'src')
const assetReferences = new Set()
const missingAssets = []
const unbasedReferences = []
const publicAssetCall = /publicAsset\(\s*(['"])(\/[^'"]+)\1\s*\)/g
const directRootAsset = /\b(?:src|href|image)\s*(?:=|:)\s*(['"])\/(?:img\/|favicon\.svg\b)/g

function checkSourceDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      checkSourceDirectory(filename)
      continue
    }
    if (!/\.(?:ts|tsx)$/.test(entry.name)) continue

    const source = readFileSync(filename, 'utf8')
    for (const match of source.matchAll(publicAssetCall)) {
      const assetPath = match[2]
      assetReferences.add(assetPath)
      const publicFile = path.join(root, 'public', assetPath.replace(/^\/+/, ''))
      if (!existsSync(publicFile)) missingAssets.push(`${path.relative(root, filename)} → ${assetPath}`)
    }

    if (directRootAsset.test(source)) {
      unbasedReferences.push(path.relative(root, filename))
    }
    directRootAsset.lastIndex = 0
  }
}

checkSourceDirectory(sourceRoot)

const html = readFileSync(path.join(root, 'index.html'), 'utf8')
if (directRootAsset.test(html)) unbasedReferences.push('index.html')

if (missingAssets.length || unbasedReferences.length) {
  if (missingAssets.length) {
    console.error('Missing files referenced through publicAsset():')
    for (const item of missingAssets) console.error(`  ${item}`)
  }
  if (unbasedReferences.length) {
    console.error('Root-relative public asset URLs bypass Vite BASE_URL:')
    for (const item of unbasedReferences) console.error(`  ${item}`)
  }
  process.exit(1)
}

console.log(`Checked ${assetReferences.size} public asset paths; all files exist and references are base-aware.`)
