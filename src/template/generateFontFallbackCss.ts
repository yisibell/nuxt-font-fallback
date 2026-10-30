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
   * Each entry with available Capsize metrics receives its own generated face.
   */
  fallbackFonts: string[]

  /** Absolute Nuxt source directory used to resolve `FontEntry.src`. */
  srcDir: string
}

/**
 * Reads custom font metrics and generates the CSS fallback declarations.
 *
 * Each custom font produces one `@font-face` rule per configured fallback
 * family. This gives every local font its own metric overrides instead of
 * applying the first fallback's metrics to the whole source stack.
 *
 * Font-level failures are returned as CSS comments so one unreadable font does
 * not prevent the remaining fallback declarations from being generated.
 *
 * @param options Font files, fallback font stack, and Nuxt source directory.
 * @param options.fonts Custom font entries to process.
 * @param options.fallbackFonts Fallback font family names.
 * @param options.srcDir Absolute Nuxt source directory.
 * @returns Generated CSS containing one fallback declaration per available
 * fallback family and custom font.
 */
export async function generateFontFallbackCss({
  fonts,
  fallbackFonts,
  srcDir,
}: GenerateFontFallbackCssOptions) {
  const results = await Promise.all(
    fonts.map(async (font, index) => {
      const filePath = path.resolve(srcDir, font.src)
      const fileUrl = pathToFileURL(filePath).href

      try {
        const metrics = await readMetrics(fileUrl)
        if (!metrics) {
          return `/* FAIL: ${font.name} - readMetrics returned null */`
        }

        const faces = await Promise.all(
          [...fallbackFonts].reverse().map(async (fallbackFamily) => {
            const fallbackMetrics = await getMetricsForFamily(fallbackFamily)
            if (!fallbackMetrics) {
              return `/* SKIP: ${font.name} - no Capsize metrics for ${fallbackFamily} */`
            }

            return generateFontFace(metrics, {
              name: font.name,
              font: fallbackFamily,
              metrics: fallbackMetrics,
            })
          }),
        )

        return `/* [${index + 1}] Fallback faces for: ${font.name} */\n${faces.join('\n')}`
      }
      catch (err: any) {
        return `/* FAIL: ${font.name} - ${err.message} */`
      }
    }),
  )

  return results.join('\n')
}
