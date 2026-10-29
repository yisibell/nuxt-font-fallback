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
   * System font stack used by generated fallback faces. The first font is used
   * for metric calculation and the complete list is emitted as local sources.
   * @default ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto', 'sans-serif']
   */
  fallbackFonts?: string[]

  /**
   * Filename of the generated CSS template inside Nuxt's build directory.
   * @default 'nuxt-font-fallback.css'
   */
  cssFilename?: string
}
