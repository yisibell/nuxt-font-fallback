import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { writeFile } from 'node:fs/promises'
import { readMetrics, generateFontFace, getMetricsForFamily } from 'fontaine'
import { defineNuxtModule } from '@nuxt/kit'

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
   * @default 'nuxt-font-metrics.css'
   */
  cssFilename?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-font-metrics',
    configKey: 'fontMetrics',
  },
  defaults: {
    fonts: [],
    fallbackFonts: ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto', 'sans-serif'],
    cssFilename: 'nuxt-font-metrics.css',
  },
  setup(options, nuxt) {
    const { fonts = [], fallbackFonts = ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto', 'sans-serif'], cssFilename = 'nuxt-font-metrics.css' } = options
    const srcDir = nuxt.options.srcDir

    if (!fonts.length) return
    if (!fallbackFonts.length) return

    async function generate() {
      const fallbackMetrics = await getMetricsForFamily(fallbackFonts[0])

      const results = await Promise.all(
        fonts.map(async (f) => {
          const filePath = path.resolve(srcDir, f.src)
          const fileUrl = pathToFileURL(filePath).href
          try {
            const metrics = await readMetrics(fileUrl)
            if (!metrics) {
              console.error('[nuxt-font-metrics] NULL metrics:', f.name)
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
            console.error('[nuxt-font-metrics] FAIL:', f.name, err.message)
            return `/* FAIL: ${f.name} - ${err.message} */`
          }
        }),
      )
      const outputPath = path.resolve(nuxt.options.buildDir, cssFilename)
      await writeFile(outputPath, results.join('\n'), 'utf-8')
      console.log('[nuxt-font-metrics] Written to:', outputPath)
    }

    nuxt.hook('build:before', generate)

    nuxt.options.css.unshift(path.resolve(nuxt.options.buildDir, cssFilename))
  },
})
