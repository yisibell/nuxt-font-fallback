import { defineNuxtModule, addTemplate } from '@nuxt/kit'
import type { ModuleOptions } from './types'
import { generateFontFallbackCss } from './template/generateFontFallbackCss'

export type { FontEntry, ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-font-fallback',
    configKey: 'fontFallback',
  },
  defaults: {
    fonts: [],
    fallbackFonts: ['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto'],
    cssFilename: 'nuxt-font-fallback.css',
    normalFallback: true,
    balancedFallback: false,
    balancedWidthWeight: 0.82,
  },
  setup(options, nuxt) {
    const {
      fonts,
      fallbackFonts,
      cssFilename,
      normalFallback,
      balancedFallback,
      balancedWidthWeight,
    } = options

    if (!fonts?.length || !fallbackFonts?.length) return

    if (cssFilename) {
      if (normalFallback) {
        const template = addTemplate({
          filename: cssFilename,
          write: true,
          getContents: () => generateFontFallbackCss({
            fonts,
            fallbackFonts,
            srcDir: nuxt.options.srcDir,
          }),
        })

        // Inject generated faces before application styles reference them.
        nuxt.options.css.unshift(`#build/${template.filename}`)
      }

      if (balancedFallback) {
        // Normalize a single weight to the same loop used for multiple variants.
        const weights = Array.isArray(balancedWidthWeight) ? balancedWidthWeight : [balancedWidthWeight ?? 0.82]
        if (weights.some(weight => !Number.isFinite(weight) || weight < 0 || weight > 1)) {
          throw new RangeError('balancedWidthWeight values must be numbers between 0 and 1')
        }
        for (const [index, weight] of weights.entries()) {
          // Keep the original unnumbered names for scalar configurations;
          // array entries need distinct family and template names to coexist.
          const suffix = Array.isArray(balancedWidthWeight) ? `Balanced${index + 1}` : 'Balanced'
          const filenameSuffix = Array.isArray(balancedWidthWeight) ? `.balanced-${index + 1}.css` : '.balanced.css'
          const balancedTemplate = addTemplate({
            filename: cssFilename.replace(/(\.css)?$/, filenameSuffix),
            write: true,
            getContents: () => generateFontFallbackCss({ fonts, fallbackFonts, srcDir: nuxt.options.srcDir, balanced: true, balancedWidthWeight: weight, balancedSuffix: suffix }),
          })
          nuxt.options.css.unshift(`#build/${balancedTemplate.filename}`)
        }
      }
    }
  },
})
