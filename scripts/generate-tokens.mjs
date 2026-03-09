import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tokensPath = resolve(__dirname, '../radix.json')
const outputPath = resolve(__dirname, '../src/tokens.css')

const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'))

const colorSet = tokens['Colors/Default'] ?? tokens.global?.color ?? {}
const typoSet = tokens['Typography'] ?? {}

function resolveRef(ref, source) {
  const match = ref.match(/^\{(.+)\}$/)
  if (!match) return ref
  const path = match[1].split('.')
  let val = source
  for (const key of path) {
    val = val?.[key]
  }
  return val?.value ?? ref
}

const themeVars = []
const rootVars = []

for (const [name, shades] of Object.entries(colorSet)) {
  if (shades?.value && shades?.type === 'color') {
    themeVars.push(`  --color-${name}: ${shades.value};`)
    rootVars.push(`  --color-${name}: ${shades.value};`)
  } else if (typeof shades === 'object' && shades !== null) {
    for (const [shade, token] of Object.entries(shades)) {
      if (token?.type === 'color') {
        themeVars.push(`  --color-${name}-${shade}: ${token.value};`)
        rootVars.push(`  --color-${name}-${shade}: ${token.value};`)
      }
    }
  }
}

const fontSizes = []
const typeSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl']

for (const size of typeSizes) {
  const variants = typoSet[size]
  if (!variants) continue

  const first = Object.values(variants)[0]
  if (!first?.value) continue

  const fontSize = resolveRef(first.value.fontSize, typoSet)
  const lineHeight = resolveRef(first.value.lineHeight, typoSet)

  if (fontSize !== undefined) {
    rootVars.push(`  --font-size-${size}: ${fontSize}px;`)
    rootVars.push(`  --line-height-${size}: ${lineHeight}px;`)
    themeVars.push(`  --font-size-${size}: ${fontSize}px;`)
    themeVars.push(`  --line-height-${size}: ${lineHeight}px;`)
  }
}

const fontWeightMap = {}
for (const [key, token] of Object.entries(typoSet.fontWeights ?? {})) {
  fontWeightMap[token.value] = token.value
}

const weightNameToNum = {
  Thin: 100, ExtraLight: 200, Light: 300, Regular: 400,
  Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800, Black: 900,
}

for (const [name, num] of Object.entries(weightNameToNum)) {
  rootVars.push(`  --font-weight-${name.toLowerCase()}: ${num};`)
  themeVars.push(`  --font-weight-${name.toLowerCase()}: ${num};`)
}

const fontFamily = typoSet.fontFamilies?.inter?.value
if (fontFamily) {
  rootVars.push(`  --font-family-default: "${fontFamily}", sans-serif;`)
  themeVars.push(`  --font-family-sans: "${fontFamily}", sans-serif;`)
}

const output = `/* Auto-generated from radix.json — do not edit manually */
/* Run: npm run tokens */

@theme {
${themeVars.join('\n')}
}

:root {
${rootVars.join('\n')}
}
`

writeFileSync(outputPath, output)

const colorCount = rootVars.filter(v => v.includes('--color-')).length
const typoCount = rootVars.filter(v => !v.includes('--color-')).length
console.log(`Generated ${colorCount} color tokens + ${typoCount} typography tokens → src/tokens.css`)
