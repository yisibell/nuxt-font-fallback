import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { generateFontFace, getMetricsForFamily, readMetrics } from 'fontaine'
import type { FontEntry } from '../types'

/**
 * Inputs required to generate the module's fallback CSS template.
 */
export interface GenerateFontFallbackCssOptions {
  /** Custom font files that need metric-matched fallback faces. */
  fonts: FontEntry[]

  /**
   * Local system font stack used by the generated fallback faces.
   * The first entry supplies the metrics used for `size-adjust` calculations.
   */
  fallbackFonts: string[]

  /** Absolute Nuxt source directory used to resolve `FontEntry.src`. */
  srcDir: string
}

/**
 * Reads custom font metrics and generates the CSS fallback declarations.
 *
 * Each custom font produces one `@font-face` rule. Fontaine calculates the
 * metric overrides from the first fallback font, while all configured fallback
 * families are included in the generated `local(...)` source list.
 *
 * Font-level failures are returned as CSS comments so one unreadable font does
 * not prevent the remaining fallback declarations from being generated.
 *
 * @param options Font files, fallback font stack, and Nuxt source directory.
 * @param options.fonts Custom font entries to process.
 * @param options.fallbackFonts Fallback font family names.
 * @param options.srcDir Absolute Nuxt source directory.
 * @returns Generated CSS containing one fallback declaration per custom font.
 */
export async function generateFontFallbackCss({
  fonts,
  fallbackFonts,
  srcDir,
}: GenerateFontFallbackCssOptions) {
  const fallbackMetrics = await getMetricsForFamily(fallbackFonts[0])

  const results = await Promise.all(
    fonts.map(async (font) => {
      const filePath = path.resolve(srcDir, font.src)
      const fileUrl = pathToFileURL(filePath).href

      try {
        const metrics = await readMetrics(fileUrl)
        if (!metrics) {
          return `/* FAIL: ${font.name} - readMetrics returned null */`
        }

        const css = generateFontFace(metrics, {
          name: font.name,
          font: fallbackFonts[0],
          metrics: fallbackMetrics ?? undefined,
        })

        return css.replace(
          `local(${JSON.stringify(fallbackFonts[0])})`,
          fallbackFonts.map(fallback => `local(${JSON.stringify(fallback)})`).join(', '),
        )
      }
      catch (err: any) {
        return `/* FAIL: ${font.name} - ${err.message} */`
      }
    }),
  )

  return results.join('\n')
}
