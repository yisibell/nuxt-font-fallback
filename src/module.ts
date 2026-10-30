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
  },
  setup(options, nuxt) {
    const {
      fonts,
      fallbackFonts,
      cssFilename,
    } = options

    if (!fonts?.length || !fallbackFonts?.length) return

    if (cssFilename) {
      const template = addTemplate({
        filename: cssFilename,
        write: true,
        getContents: () => generateFontFallbackCss({
          fonts,
          fallbackFonts,
          srcDir: nuxt.options.srcDir,
        }),
      })

      nuxt.options.css.unshift(`#build/${template.filename}`)
    }
  },
})
