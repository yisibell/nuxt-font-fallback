import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { generateFontFace, getMetricsForFamily, readMetrics } from 'fontaine'
import { fromFile } from '@capsizecss/unpack/fs'
import { entireMetricsCollection } from '@capsizecss/metrics/entireMetricsCollection'
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
  /**
   * Generate faces with `Balanced` appended to each configured family name.
   * Faces without the required metrics are skipped.
   * @default false
   */
  balanced?: boolean
  /** Weight for average-width matching, between 0 and 1. @default 0.82 */
  balancedWidthWeight?: number
  /** Suffix for balanced font families. @default 'Balanced' */
  balancedSuffix?: string
}

/**
 * Reads custom font metrics and generates the CSS fallback declarations.
 *
 * Each custom font produces one `@font-face` rule per configured fallback
 * family with available metrics. Each local font gets its own overrides. Faces
 * are emitted in reverse fallback order so the configured first family has
 * precedence when multiple local faces are available.
 *
 * Balanced mode appends `Balanced` to the configured family name and combines
 * average-width and x-height scales using the configured weight.
 * Vertical overrides are recalculated for that scale. This is an approximate
 * match and does not guarantee identical widths or line breaks.
 *
 * Missing metrics produce CSS comments for the affected fallback. Font-level
 * errors produce a comment for that font without stopping other font entries.
 *
 * @param options Font files, fallback font stack, source directory, and mode.
 * @param options.fonts Custom font entries to process.
 * @param options.fallbackFonts Fallback font family names.
 * @param options.srcDir Absolute Nuxt source directory.
 * @param options.balanced Whether to generate balanced faces; defaults to false.
 * @param options.balancedWidthWeight Weight for average width, from 0 to 1.
 * @param options.balancedSuffix Font family suffix used in balanced mode.
 * @returns Generated CSS declarations and comments for skipped or failed entries.
 */
export async function generateFontFallbackCss({
  fonts,
  fallbackFonts,
  srcDir,
  balanced = false,
  balancedWidthWeight = 0.82,
  balancedSuffix = 'Balanced',
}: GenerateFontFallbackCssOptions) {
  if (!Number.isFinite(balancedWidthWeight) || balancedWidthWeight < 0 || balancedWidthWeight > 1) {
    throw new RangeError('balancedWidthWeight must be a number between 0 and 1')
  }
  const results = await Promise.all(
    fonts.map(async (font, index) => {
      const filePath = path.resolve(srcDir, font.src)
      const fileUrl = pathToFileURL(filePath).href

      try {
        const metrics = await readMetrics(fileUrl)
        if (!metrics) {
          return `/* FAIL: ${font.name} - readMetrics returned null */`
        }

        // Fontaine exposes the metrics used by its generator, but filters out
        // x-height, so balanced mode also reads the full target font metrics.
        const targetDetail = balanced ? await fromFile(filePath) : undefined

        const faces = await Promise.all(
          // Later matching @font-face rules take precedence: emit the preferred
          // fallback last while preserving the configured priority order.
          [...fallbackFonts].reverse().map(async (fallbackFamily) => {
            const fallbackMetrics = await getMetricsForFamily(fallbackFamily)
            if (!fallbackMetrics) {
              return `/* SKIP: ${font.name} - no Capsize metrics for ${fallbackFamily} */`
            }

            if (balanced) {
              const detail = Object.values(entireMetricsCollection).find(
                entry => entry.familyName.toLowerCase() === fallbackFamily.toLowerCase(),
              )
              if (!detail || !('xHeight' in detail) || !detail.xHeight || !targetDetail?.xHeight || !fallbackMetrics.xWidthAvg || !metrics.xWidthAvg) {
                return `/* SKIP: ${font.name} - no x-height metrics for ${fallbackFamily} or target font */`
              }
              // Normalize by unitsPerEm before comparing metrics from fonts
              // that may use different internal coordinate systems.
              const widthScale = (metrics.xWidthAvg / metrics.unitsPerEm) / (fallbackMetrics.xWidthAvg / fallbackMetrics.unitsPerEm)
              const heightScale = (targetDetail.xHeight / targetDetail.unitsPerEm) / (detail.xHeight / detail.unitsPerEm)
              const scale = widthScale * balancedWidthWeight + heightScale * (1 - balancedWidthWeight)
              // Fontaine derives size-adjust from xWidthAvg. Supply the inverse
              // of its formula to obtain the chosen scale and let Fontaine
              // recalculate the associated vertical overrides consistently.
              return generateFontFace(metrics, {
                name: `${font.name}${balancedSuffix}`,
                font: fallbackFamily,
                metrics: { ...fallbackMetrics, xWidthAvg: metrics.xWidthAvg * fallbackMetrics.unitsPerEm / (metrics.unitsPerEm * scale) },
              })
            }

            return generateFontFace(metrics, {
              name: font.name,
              font: fallbackFamily,
              metrics: fallbackMetrics,
            })
          }),
        )

        return `/* [${index + 1}] Fallback faces for: ${font.name}${balanced ? balancedSuffix : ''} */\n${faces.join('\n')}`
      }
      catch (err: any) {
        return `/* FAIL: ${font.name} - ${err.message} */`
      }
    }),
  )

  return results.join('\n')
}
