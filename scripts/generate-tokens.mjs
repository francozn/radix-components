import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tokensPath = resolve(__dirname, '../radix.json')
const outputPath = resolve(__dirname, '../src/tokens.css')

const tokens = JSON.parse(readFileSync(tokensPath, 'utf-8'))
const colors = tokens.global?.color ?? {}

const cssVars = []
const themeVars = []

for (const [name, shades] of Object.entries(colors)) {
  if (shades.value && shades.type === 'color') {
    cssVars.push(`  --color-${name}: ${shades.value};`)
    themeVars.push(`  --color-${name}: ${shades.value};`)
  } else {
    for (const [shade, token] of Object.entries(shades)) {
      if (token.type === 'color') {
        cssVars.push(`  --color-${name}-${shade}: ${token.value};`)
        themeVars.push(`  --color-${name}-${shade}: ${token.value};`)
      }
    }
  }
}

const output = `/* Auto-generated from radix.json — do not edit manually */
/* Run: npm run tokens */

@theme {
${themeVars.join('\n')}
}

:root {
${cssVars.join('\n')}
}
`

writeFileSync(outputPath, output)
console.log(`Generated ${cssVars.length} color tokens → src/tokens.css`)
