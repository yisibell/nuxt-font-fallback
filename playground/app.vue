<template>
  <div
    class="demo"
    :class="{ 'override-off': !overrideEnabled }"
  >
    <header class="hero">
      <h1 class="hero-title">
        nuxt-font-fallback
      </h1>
      <p class="hero-subtitle">
        Eliminate layout shift caused by web font loading.
        Each font below uses metric-matched fallbacks generated from the
        <code>@font-face</code> override descriptors.
      </p>

      <div class="toggle-bar">
        <button
          class="toggle"
          :class="{ active: overrideEnabled }"
          @click="overrideEnabled = !overrideEnabled"
        >
          <span class="toggle-knob" />
        </button>
        <span class="toggle-label">
          Metric Override <strong>{{ overrideEnabled ? 'ON' : 'OFF' }}</strong>
        </span>
      </div>

      <p class="hero-hint">
        {{ overrideEnabled
          ? 'Fallback font metrics match the web font. No layout shift when fonts load.'
          : 'Browser uses default fallback. Refresh with cache disabled to see the shift.'
        }}
      </p>

      <div class="hero-badge">
        <span class="badge">@nuxt/kit</span>
        <span class="badge">fontaine</span>
        <span class="badge">CLS ≈ {{ overrideEnabled ? '0.0001' : '0.1' }}</span>
      </div>
    </header>

    <section class="showcase">
      <div class="card">
        <div class="card-header">
          <span class="card-label">Body</span>
          <span class="card-name">Gotham Book</span>
        </div>
        <p class="card-sample base">
          The quick brown fox jumps over the lazy dog.
          <small>0123456789 — !@#$%^&*()</small>
        </p>
        <div class="card-sizes">
          <span class="size-sm base">12px</span>
          <span class="size-md base">16px</span>
          <span class="size-lg base">24px</span>
          <span class="size-xl base">32px</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-label">Accent</span>
          <span class="card-name">Gotham Medium</span>
        </div>
        <p class="card-sample accent">
          The quick brown fox jumps over the lazy dog.
          <small>0123456789 — !@#$%^&*()</small>
        </p>
        <div class="card-sizes">
          <span class="size-sm accent">12px</span>
          <span class="size-md accent">16px</span>
          <span class="size-lg accent">24px</span>
          <span class="size-xl accent">32px</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-label">Bold</span>
          <span class="card-name">Gotham Bold</span>
        </div>
        <p class="card-sample bold">
          The quick brown fox jumps over the lazy dog.
          <small>0123456789 — !@#$%^&*()</small>
        </p>
        <div class="card-sizes">
          <span class="size-sm bold">12px</span>
          <span class="size-md bold">16px</span>
          <span class="size-lg bold">24px</span>
          <span class="size-xl bold">32px</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-label">Title</span>
          <span class="card-name">Blacker Pro Display</span>
        </div>
        <p class="card-sample title">
          The quick brown fox jumps over the lazy dog.
          <small>0123456789 — !@#$%^&*()</small>
        </p>
        <div class="card-sizes">
          <span class="size-sm title">12px</span>
          <span class="size-md title">16px</span>
          <span class="size-lg title">24px</span>
          <span class="size-xl title">32px</span>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-label">Title Thin</span>
          <span class="card-name">Blacker Pro Light</span>
        </div>
        <p class="card-sample title-thin">
          The quick brown fox jumps over the lazy dog.
          <small>0123456789 — !@#$%^&*()</small>
        </p>
        <div class="card-sizes">
          <span class="size-sm title-thin">12px</span>
          <span class="size-md title-thin">16px</span>
          <span class="size-lg title-thin">24px</span>
          <span class="size-xl title-thin">32px</span>
        </div>
      </div>
    </section>

    <footer class="info">
      <p>
        Toggle <strong>Disable cache</strong> in DevTools and reload to see the fallback
        font before the web font loads. With metric overrides, there is zero layout shift.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useCookie } from '#imports'

const overrideEnabled = useCookie('metric-override', { default: () => true })
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #fafafa;
  color: #1a1a1a;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.demo {
  min-height: 100vh;
}

// ─── Hero ──────────────────────────────────────────
.hero {
  text-align: center;
  padding: 4rem 2rem 3rem;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  color: #e6edf3;
}

.hero-title {
  font-family: var(--jjs-font-family-title);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-family: var(--jjs-font-family-base);
  font-size: 1.1rem;
  line-height: 1.7;
  color: #8b949e;
  max-width: 560px;
  margin: 0 auto 1.5rem;

  code {
    background: rgba(255, 255, 255, 0.08);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    color: #e6edf3;
  }
}

// ─── Toggle ────────────────────────────────────────
.toggle-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.toggle {
  position: relative;
  width: 44px;
  height: 26px;
  border-radius: 100px;
  border: none;
  background: #30363d;
  cursor: pointer;
  transition: background 0.25s;
  flex-shrink: 0;

  &.active {
    background: #238636;
  }
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.25s;

  .active & {
    transform: translateX(18px);
  }
}

.toggle-label {
  font-family: var(--jjs-font-family-base);
  font-size: 0.95rem;
  color: #c9d1d9;

  strong {
    font-family: var(--jjs-font-family-accent);
    color: #e6edf3;
    min-width: 2.5em;
    display: inline-block;
    text-align: left;
  }
}

.hero-hint {
  font-family: var(--jjs-font-family-base);
  font-size: 0.85rem;
  color: #6e7681;
  max-width: 480px;
  margin: 0 auto 1.25rem;
  line-height: 1.5;
  min-height: 2.55em;
}

.hero-badge {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.badge {
  font-family: var(--jjs-font-family-accent);
  font-size: 0.75rem;
  padding: 0.3em 0.75em;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #8b949e;
  letter-spacing: 0.02em;
}

// ─── Showcase ──────────────────────────────────────
.showcase {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.75rem;
  transition: border-color 0.2s;

  &:hover {
    border-color: #c4c8cf;
  }
}

.card-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.card-label {
  font-family: var(--jjs-font-family-accent);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
  background: #0d1117;
  padding: 0.25em 0.6em;
  border-radius: 4px;
}

.card-name {
  font-family: var(--jjs-font-family-base);
  font-size: 0.85rem;
  color: #6b7280;
}

.card-sample {
  margin-bottom: 1.25rem;
  line-height: 1.5;

  small {
    display: block;
    margin-top: 0.35rem;
    opacity: 0.45;
    font-size: 0.75em;
  }
}

.card-sizes {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: baseline;
}

.size-sm {
  font-size: 0.75rem;
}
.size-md {
  font-size: 1rem;
}
.size-lg {
  font-size: 1.5rem;
}
.size-xl {
  font-size: 2rem;
}

// ─── Font bindings (with override ON) ───────────────
.base {
  font-family: var(--jjs-font-family-base);
}
.accent {
  font-family: var(--jjs-font-family-accent);
}
.bold {
  font-family: var(--jjs-font-family-accent-bold);
}
.title {
  font-family: var(--jjs-font-family-title);
}
.title-thin {
  font-family: var(--jjs-font-family-title-thin);
}

// ─── Font bindings (override OFF) ───────────────────
.override-off {
  --jjs-font-family-base: GothamBook;
  --jjs-font-family-accent: GothamMedium;
  --jjs-font-family-accent-bold: GothamBold;
  --jjs-font-family-title: BlackerProDisplayRegular;
  --jjs-font-family-title-thin: BlackerProDisplayLight;
}

// ─── Footer ────────────────────────────────────────
.info {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  text-align: center;

  p {
    font-family: var(--jjs-font-family-base);
    font-size: 0.9rem;
    line-height: 1.7;
    color: #6b7280;
  }

  strong {
    font-family: var(--jjs-font-family-accent);
    color: #374151;
  }
}
</style>
