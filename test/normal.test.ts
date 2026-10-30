import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { generateFontFallbackCss } from '../src/template/generateFontFallbackCss'

describe('normal fallback CSS', () => {
  it('generates one Capsize-matched face per fallback family', async () => {
    const css = await generateFontFallbackCss({
      fonts: [{
        name: 'GothamBookOverride',
        src: 'public/fonts/gotham/Gotham-Book.otf',
      }],
      fallbackFonts: ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto', 'sans-serif'],
      srcDir: fileURLToPath(new URL('../playground', import.meta.url)),
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
})
