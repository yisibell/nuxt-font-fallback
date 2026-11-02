import { beforeEach, describe, expect, it, vi } from 'vitest'

const { addTemplate } = vi.hoisted(() => ({ addTemplate: vi.fn((template: { filename: string }) => template) }))

vi.mock('@nuxt/kit', () => ({
  addTemplate,
  defineNuxtModule: (module: unknown) => module,
}))

import fontFallbackModule from '../src/module'

describe('fallback template options', () => {
  beforeEach(() => addTemplate.mockClear())

  it('generates balanced templates without the standard template when disabled', () => {
    const definition = fontFallbackModule as unknown as { setup: (options: object, nuxt: object) => void }
    const nuxt = { options: { srcDir: '/example', css: [] as string[] } }
    definition.setup({
      fonts: [{ name: 'Example', src: 'font.otf' }],
      fallbackFonts: ['Arial'],
      cssFilename: 'fonts.css',
      normalFallback: false,
      balancedFallback: true,
      balancedWidthWeight: [0.27, 0.9],
    }, nuxt)

    expect(addTemplate.mock.calls.map(([template]) => template.filename)).toEqual(['fonts.balanced-1.css', 'fonts.balanced-2.css'])
    expect(nuxt.options.css).toEqual(['#build/fonts.balanced-2.css', '#build/fonts.balanced-1.css'])
  })
})
