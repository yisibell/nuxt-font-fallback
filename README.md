# nuxt-font-metrics

[![npm version](https://img.shields.io/npm/v/nuxt-font-metrics.svg)](https://npmjs.com/package/nuxt-font-metrics)
[![license](https://img.shields.io/npm/l/nuxt-font-metrics.svg)](./LICENSE)

Automatic font metric fallback for [Nuxt](https://nuxt.com). Powered by [fontaine](https://github.com/unjs/fontaine) + [capsize](https://github.com/seek-oss/capsize).

## Why

Custom web fonts cause Cumulative Layout Shift (CLS) while loading. This module reads your font files at build time, computes metric overrides (`size-adjust`, `ascent-override`, `descent-override`), and generates `@font-face` fallback declarations so text never jumps.

## Quick Start

```bash
npm install nuxt-font-metrics
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    ['nuxt-font-metrics', {
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
| `fallbackFonts` | `string[]` | `['Arial', 'Helvetica Neue', 'Helvetica', 'Roboto', 'sans-serif']` | System font stack; first is used for metrics |
| `cssFilename` | `string` | `'nuxt-font-metrics.css'` | Output CSS filename |

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
2. Retrieves the first fallback font's metrics from the capsize database
3. Computes `size-adjust`, `ascent-override`, `descent-override`
4. Generates `@font-face` declarations with multi-platform `src: local(...)` chains
5. Injects the CSS globally before other styles

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