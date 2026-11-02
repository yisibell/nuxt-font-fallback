/**
 * A custom font source and the family name used by its generated fallback.
 */
export interface FontEntry {
  /**
   * Font family name emitted in the generated `@font-face` rule.
   */
  name: string

  /**
   * Font file path relative to the Nuxt source directory.
   * For example: `public/fonts/Gotham-Book.otf`.
   */
  src: string
}

/**
 * Configuration accepted by the `nuxt-font-fallback` module.
 */
export interface ModuleOptions {
  /**
   * Custom fonts to generate metric-matched fallbacks for.
   * Each entry maps a custom font file to an override family name.
   */
  fonts?: FontEntry[]

  /**
   * Local font families in priority order. Each family with available metrics
   * receives a separate fallback face with its own local sources and overrides.
   * @default ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto']
   */
  fallbackFonts?: string[]

  /**
   * Filename of the generated CSS template inside Nuxt's build directory.
   * @default 'nuxt-font-fallback.css'
   */
  cssFilename?: string

  /** Generate the standard average-width fallback CSS. @default true */
  normalFallback?: boolean

  /**
   * Generate an additional CSS file with balanced fallback faces. Each family
   * name appends `Balanced` to the corresponding configured font name. The
   * scale combines average-width and x-height matching.
   * Faces missing the required metrics are skipped.
   * @default false
   */
  balancedFallback?: boolean

  /** One weight or an array of weights between 0 and 1. @default 0.82 */
  balancedWidthWeight?: number | number[]
}
