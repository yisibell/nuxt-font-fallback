import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxt/fonts',
    '../src/module',
  ],

  devtools: {
    enabled: false,
  },

  css: [
    '~/assets/styles/index.scss',
  ],

  compatibilityDate: '2024-12-30',

  fontFallback: {
    fonts: [
      { name: 'GothamBookOverride', src: 'public/fonts/gotham/Gotham-Book.otf' },
      { name: 'GothamMediumOverride', src: 'public/fonts/gotham/Gotham-Medium.otf' },
      { name: 'GothamBoldOverride', src: 'public/fonts/gotham/Gotham-Bold.otf' },
      { name: 'BlackerProDisplayRegularOverride', src: 'public/fonts/blacker-pro/BlackerProDisplayRegular.otf' },
      { name: 'BlackerProDisplayLightOverride', src: 'public/fonts/blacker-pro/BlackerProDisplayLight.otf' },
    ],
  },

  fonts: {
    processCSSVariables: true,
    families: [
      { name: 'GothamBook', src: '/fonts/gotham/Gotham-Book.otf', preload: false, display: 'swap' },
      { name: 'GothamMedium', src: '/fonts/gotham/Gotham-Medium.otf', preload: false, display: 'swap' },
      { name: 'GothamBold', src: '/fonts/gotham/Gotham-Bold.otf', preload: false, display: 'swap' },
      { name: 'BlackerProDisplayRegular', src: '/fonts/blacker-pro/BlackerProDisplayRegular.otf', preload: false, display: 'swap' },
      { name: 'BlackerProDisplayLight', src: '/fonts/blacker-pro/BlackerProDisplayLight.otf', preload: false, display: 'swap' },
    ],
  },
})
