import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { readMetrics, generateFontFace, getMetricsForFamily } from 'fontaine'
import { defineNuxtModule, addTemplate } from '@nuxt/kit'

export interface FontEntry {
  name: string
  src: string
}

export interface ModuleOptions {
  /**
   * Custom fonts to generate metric-matched fallbacks for.
   * Each entry maps a custom font file to an override family name.
   */
  fonts?: FontEntry[]

  /**
   * System font stack for fallback. First font is used for metric calculation.
   * @default ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto', 'sans-serif']
   */
  fallbackFonts?: string[]

  /**
   * Output CSS filename in the Nuxt build directory.
   * @default 'nuxt-font-fallback.css'
   */
  cssFilename?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-font-fallback',
    configKey: 'fontFallback',
  },
  defaults: {
    fonts: [],
    fallbackFonts: ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto', 'sans-serif'],
    cssFilename: 'nuxt-font-fallback.css',
  },
  setup(options, nuxt) {
    const {
      fonts = [],
      fallbackFonts = ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto', 'sans-serif'],
      cssFilename = 'nuxt-font-fallback.css',
    } = options

    if (!fonts.length || !fallbackFonts.length) return

    addTemplate({
      filename: cssFilename,
      write: true,
      async getContents() {
        const fallbackMetrics = await getMetricsForFamily(fallbackFonts[0])

        const results = await Promise.all(
          fonts.map(async (f) => {
            const filePath = path.resolve(nuxt.options.srcDir, f.src)
            const fileUrl = pathToFileURL(filePath).href
            try {
              const metrics = await readMetrics(fileUrl)
              if (!metrics) {
                return `/* FAIL: ${f.name} - readMetrics returned null */`
              }
              const css = generateFontFace(metrics, {
                name: f.name,
                font: fallbackFonts[0],
                metrics: fallbackMetrics ?? undefined,
              })
              return css.replace(
                `local(${JSON.stringify(fallbackFonts[0])})`,
                fallbackFonts.map(fb => `local(${JSON.stringify(fb)})`).join(', '),
              )
            }
            catch (err: any) {
              return `/* FAIL: ${f.name} - ${err.message} */`
            }
          }),
        )
        return results.join('\n')
      },
    })

    nuxt.options.css.unshift(path.resolve(nuxt.options.buildDir, cssFilename))
  },
})
