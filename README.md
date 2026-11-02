# nuxt-font-fallback

[![npm version](https://img.shields.io/npm/v/nuxt-font-fallback.svg)](https://npmjs.com/package/nuxt-font-fallback)
[![license](https://img.shields.io/npm/l/nuxt-font-fallback.svg)](./LICENSE)

Automatic font metric fallback for [Nuxt](https://nuxt.com). Powered by [fontaine](https://github.com/unjs/fontaine) + [capsize](https://github.com/seek-oss/capsize).

## Why

Custom web fonts can cause Cumulative Layout Shift (CLS) while loading. This module reads your font files at build time, computes metric overrides (`size-adjust`, `ascent-override`, `descent-override`), and generates `@font-face` fallback declarations to reduce layout changes.

## Quick Start

```bash
npm install nuxt-font-fallback
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    ['nuxt-font-fallback', {
      fonts: [
        { name: 'GothamOverride', src: 'public/fonts/Gotham-Book.otf' },
      ],
    }],
  ],
})
```

Then reference the override family in your CSS:

```css
:root {
  font-family: 'Gotham', GothamOverride;
}
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `fonts` | `FontEntry[]` | `[]` | Custom fonts to generate fallbacks for |
| `fallbackFonts` | `string[]` | `['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto']` | Local font families in priority order; each uses its own metrics |
| `cssFilename` | `string` | `'nuxt-font-fallback.css'` | Output CSS filename |
| `normalFallback` | `boolean` | `true` | Generate the standard fallback CSS |
| `balancedFallback` | `boolean` | `false` | Also generate a separate fallback balancing **average width** and **x-height** |
| `balancedWidthWeight` | `number \| number[]` | `0.82` | One or more weights between 0 and 1 for balanced faces |

Set `balancedFallback: true` to generate an additional `nuxt-font-fallback.balanced.css` file. Its family names append `Balanced` to each configured name, for example `GothamOverrideBalanced`. Use it explicitly:

```css
font-family: 'Gotham', 'GothamOverrideBalanced', sans-serif;
```

The scale combines **average-width** and **x-height** matching using `balancedWidthWeight` (default 82% width, 18% height); vertical overrides are recalculated. Lower values favor **x-height** and may improve or worsen particular strings. Faces without usable **x-height** data are skipped. This compromise cannot guarantee identical line breaks or eliminate CLS.

With `balancedWidthWeight: 1`, the balanced scale uses only **average-width** matching, so its calculated overrides generally match the standard fallback. However, balanced generation still requires usable **x-height** metrics for both fonts, and may skip a face that standard generation can produce. Balanced faces also use their own family names and CSS files.

To generate several alternatives, set `balancedWidthWeight: [0.27, 0.9]`. With the default CSS filename, this generates `nuxt-font-fallback.balanced-1.css` and `nuxt-font-fallback.balanced-2.css`. Their font families are `GothamOverrideBalanced1` and `GothamOverrideBalanced2`, respectively. Array order determines the suffix; an empty array generates no balanced files. A single numeric value retains the unnumbered filename and family name.

Set `normalFallback: false` alongside `balancedFallback: true` to generate only balanced CSS. `cssFilename` remains the base used to name the balanced files.

### `FontEntry`

```ts
interface FontEntry {
  /** @font-face font-family name for the fallback, e.g. 'GothamOverride' */
  name: string
  /** Path relative to srcDir, e.g. 'public/fonts/Gotham-Book.otf' */
  src: string
}
```

## How It Works

1. Reads each font file via `fontaine`'s `readMetrics`
2. Retrieves metrics for each configured fallback font through `fontaine`
3. Computes `size-adjust`, `ascent-override`, `descent-override`
4. Generates one metric-matched `@font-face` declaration for each local fallback family
5. Injects the CSS globally before other styles

For the problem, solution, and implementation details, see [Font Loading and Layout Shift](./docs/how-it-works.md) / [关于字体加载导致的布局偏移](./docs/how-it-works.zh.md).

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm dev:prepare

# Develop with the playground
pnpm dev

# Build the playground
pnpm dev:build

# Run ESLint
pnpm lint

# Run Vitest
pnpm test
pnpm test:watch

# Release new version
pnpm release
```

## License

MIT
