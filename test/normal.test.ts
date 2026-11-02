import { fileURLToPath, pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import { getMetricsForFamily, readMetrics } from 'fontaine'
import { generateFontFallbackCss } from '../src/template/generateFontFallbackCss'

const srcDir = fileURLToPath(new URL('../playground', import.meta.url))
const fontPath = fileURLToPath(new URL('../playground/public/fonts/gotham/Gotham-Book.otf', import.meta.url))

describe('normal fallback CSS', () => {
  it('generates a separate balanced fallback with matched vertical metrics', async () => {
    const options = { fonts: [{ name: 'GothamBookOverride', src: 'public/fonts/gotham/Gotham-Book.otf' }], fallbackFonts: ['Arial'], srcDir }
    const normal = await generateFontFallbackCss(options)
    const balanced = await generateFontFallbackCss({ ...options, balanced: true })
    const value = (css: string, property: string) => Number(css.match(new RegExp(`${property}: ([\\d.]+)%`))?.[1])
    expect(normal).toContain('font-family: "GothamBookOverride"')
    expect(balanced).toContain('font-family: "GothamBookOverrideBalanced"')
    expect(value(balanced, 'size-adjust')).toBeGreaterThan(99)
    expect(value(balanced, 'size-adjust')).toBeLessThan(value(normal, 'size-adjust'))
    expect(value(balanced, 'size-adjust')).toBeCloseTo(110.28, 1)
    expect(value(balanced, 'ascent-override') * value(balanced, 'size-adjust') / 100).toBeCloseTo(96, 2)
    expect(value(balanced, 'descent-override') * value(balanced, 'size-adjust') / 100).toBeCloseTo(24, 2)
    expect(await generateFontFallbackCss(options)).toBe(normal)
    const tagBalanced = await generateFontFallbackCss({ ...options, balanced: true, balancedWidthWeight: 0.3 })
    expect(value(tagBalanced, 'size-adjust')).toBeCloseTo(103.57, 1)
    expect(value(tagBalanced, 'ascent-override') * value(tagBalanced, 'size-adjust') / 100).toBeCloseTo(96, 2)
    await expect(generateFontFallbackCss({ ...options, balanced: true, balancedWidthWeight: 1.1 })).rejects.toThrow('between 0 and 1')
    const numbered = await generateFontFallbackCss({ ...options, balanced: true, balancedWidthWeight: 0.27, balancedSuffix: 'Balanced1' })
    expect(numbered).toContain('font-family: "GothamBookOverrideBalanced1"')
    expect(value(numbered, 'size-adjust')).toBeCloseTo(103.19, 1)
  })
  it('generates one Capsize-matched face per fallback family', async () => {
    const css = await generateFontFallbackCss({
      fonts: [{
        name: 'GothamBookOverride',
        src: 'public/fonts/gotham/Gotham-Book.otf',
      }],
      fallbackFonts: ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto', 'sans-serif'],
      srcDir,
    })

    expect(css.match(/@font-face/g)).toHaveLength(4)
    expect(css).toContain('/* [1] Fallback faces for: GothamBookOverride */')
    expect(css).toContain('src: local("Arial"), local("Arial Regular")')
    expect(css).toContain('src: local("Helvetica Neue"), local("Helvetica Neue Regular")')
    expect(css).toContain('src: local("Helvetica"), local("Helvetica Regular")')
    expect(css).toContain('src: local("Roboto"), local("Roboto Regular")')
    expect(css).toContain('no Capsize metrics for sans-serif')
    expect(css).not.toContain('local("Arial"), local("Helvetica Neue")')
    expect(css.indexOf('src: local("Arial"), local("Arial Regular")')).toBeGreaterThan(
      css.indexOf('src: local("Roboto"), local("Roboto Regular")'),
    )
  })

  it('matches the generated metric overrides to Fontaine calculations', async () => {
    const [fontMetrics, fallbackMetrics] = await Promise.all([
      readMetrics(pathToFileURL(fontPath).href),
      getMetricsForFamily('Arial'),
    ])
    expect(fontMetrics).toBeTruthy()
    expect(fallbackMetrics).toBeTruthy()

    const css = await generateFontFallbackCss({
      fonts: [{ name: 'GothamBookOverride', src: 'public/fonts/gotham/Gotham-Book.otf' }],
      fallbackFonts: ['Arial'],
      srcDir,
    })
    const rules = Object.fromEntries(
      [...css.matchAll(/(size-adjust|ascent-override|descent-override|line-gap-override):\s*([\d.]+%)/g)]
        .map(([, property, value]) => [property, Number.parseFloat(value)]),
    )

    const sizeAdjust = (fontMetrics!.xWidthAvg / fontMetrics!.unitsPerEm)
      / (fallbackMetrics!.xWidthAvg / fallbackMetrics!.unitsPerEm)
    const adjustedEm = fontMetrics!.unitsPerEm * sizeAdjust
    const expected = {
      'size-adjust': sizeAdjust * 100,
      'ascent-override': fontMetrics!.ascent / adjustedEm * 100,
      'descent-override': Math.abs(fontMetrics!.descent) / adjustedEm * 100,
      'line-gap-override': fontMetrics!.lineGap / adjustedEm * 100,
    }

    for (const [property, value] of Object.entries(expected)) {
      expect(rules[property]).toBeCloseTo(value, 2)
    }
  })
})
