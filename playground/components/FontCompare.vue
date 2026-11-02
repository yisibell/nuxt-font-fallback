<template>
  <section class="compare-card">
    <div class="compare-header">
      <div>
        <span class="compare-label">Compare</span>
        <h2>{{ title }}</h2>
      </div>
      <p>Same text, size, width and line-height</p>
    </div>

    <div class="compare-stack">
      <div class="sample-block">
        <div class="sample-meta">
          <strong>Web font</strong>
          <code>{{ webFont }}</code>
        </div>
        <p
          class="sample-text"
          :style="{ fontFamily: webFont }"
        >
          The quick brown fox jumps over the lazy dog. 0123456789
        </p>
        <p
          class="sample-text uppercase-sample"
          :style="{ fontFamily: webFont }"
        >
          {{ uppercaseSample }}
        </p>
        <p
          class="sample-text sample-text-secondary"
          :style="{ fontFamily: webFont }"
        >
          ABCDEFGHIJKLMNOPQRSTUVWXYZ — !@#$%^&*()
        </p>
      </div>

      <div
        class="sample-divider"
        aria-hidden="true"
      >
        ↓
      </div>

      <div class="sample-block fallback-block">
        <div class="sample-meta">
          <strong>Metric fallback</strong>
          <code>{{ fallbackFont }}</code>
        </div>
        <p
          class="sample-text"
          :style="{ fontFamily: fallbackFont }"
        >
          The quick brown fox jumps over the lazy dog. 0123456789
        </p>
        <p
          class="sample-text uppercase-sample"
          :style="{ fontFamily: fallbackFont }"
        >
          {{ uppercaseSample }}
        </p>
        <p
          class="sample-text sample-text-secondary"
          :style="{ fontFamily: fallbackFont }"
        >
          ABCDEFGHIJKLMNOPQRSTUVWXYZ — !@#$%^&*()
        </p>
      </div>

      <template
        v-for="(weight, index) in balancedWeights"
        :key="index"
      >
        <div
          class="sample-divider"
          aria-hidden="true"
        >
          ↓
        </div>
        <div class="sample-block">
          <div class="sample-meta">
            <strong>Balanced fallback ({{ weight }})</strong>
            <code>{{ fallbackFont }}Balanced{{ index + 1 }}</code>
          </div>
          <p
            class="sample-text"
            :style="{ fontFamily: `${fallbackFont}Balanced${index + 1}` }"
          >
            The quick brown fox jumps over the lazy dog. 0123456789
          </p>
          <p
            class="sample-text uppercase-sample"
            :style="{ fontFamily: `${fallbackFont}Balanced${index + 1}` }"
          >
            {{ uppercaseSample }}
          </p>
          <p
            class="sample-text sample-text-secondary"
            :style="{ fontFamily: `${fallbackFont}Balanced${index + 1}` }"
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ — !@#$%^&amp;*()
          </p>
        </div>
      </template>
    </div>
    <p
      class="measurements"
      aria-live="polite"
    >
      {{ measurement }}
    </p>
    <p
      class="measurements"
      aria-live="polite"
    >
      {{ uppercaseMeasurement }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  title: string
  webFont: string
  fallbackFont: string
}>()

const measurement = ref('Loading fonts for width comparison…')
const uppercaseMeasurement = ref('')
const sample = 'The quick brown fox jumps over the lazy dog. 0123456789'
const uppercaseSample = 'MOTHER OF THE BRIDE DRESSES'
const balancedWeights = [0.27, 0.9]

onMounted(async () => {
  try {
    const families = [props.webFont, props.fallbackFont, ...balancedWeights.map((_, index) => `${props.fallbackFont}Balanced${index + 1}`)]
    // A family can contain several local faces; missing local fonts may reject
    // load() even when a different face in the same family is available.
    await Promise.allSettled(families.map(family => document.fonts.load(`20px "${family}"`, sample)))
    await document.fonts.ready
    const loaded = Array.from(document.fonts).filter(face => face.status === 'loaded')
    const missing = families.filter(family => !loaded.some(face => face.family.replace(/^["']|["']$/g, '').toLowerCase() === family.toLowerCase()))
    if (missing.length) {
      measurement.value = `Width comparison unavailable: no loaded face for ${missing.join(', ')}.`
      return
    }
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) return
    const measure = (text: string, label: string) => {
      const widths = families.map((family) => {
        ctx.font = `20px "${family}"`
        return ctx.measureText(text).width
      })
      const difference = (width: number) => `${((width / widths[0]! - 1) * 100).toFixed(2)}%`
      const balanced = balancedWeights.map((weight, index) => `balanced ${weight} ${widths[index + 2]!.toFixed(2)}px (${difference(widths[index + 2]!)})`)
      return `${label} at 20px: web ${widths[0]!.toFixed(2)}px · metric ${widths[1]!.toFixed(2)}px (${difference(widths[1]!)}) · ${balanced.join(' · ')}`
    }
    measurement.value = measure(sample, 'Single-line width')
    uppercaseMeasurement.value = measure(uppercaseSample, 'Uppercase width')
  }
  catch {
    measurement.value = 'Width comparison unavailable: a font could not be loaded.'
  }
})
</script>

<style scoped lang="scss">
.compare-card {
  padding: 1.75rem;
  border: 1px solid #d8dee4;
  border-radius: 12px;
  background: #fff;
}

.measurements {
  margin-top: 1rem;
  font:
    0.75rem/1.5 system-ui,
    sans-serif;
  color: #4b5563;
}

.compare-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.compare-header h2 {
  margin-top: 0.5rem;
  font-family: var(--jjs-font-family-base);
  font-size: 1.25rem;
  font-weight: 500;
}

.compare-header p {
  font-family: var(--jjs-font-family-base);
  font-size: 0.75rem;
  color: #6b7280;
}

.compare-label {
  padding: 0.25em 0.6em;
  border-radius: 4px;
  background: #e8f5ee;
  font-family: var(--jjs-font-family-accent);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #17663b;
}

.compare-stack {
  max-width: 680px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.sample-block {
  padding: 1.25rem;
}

.fallback-block {
  background: #f8fafc;
}

.sample-meta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
  font-family: var(--jjs-font-family-base);
  font-size: 0.75rem;
  color: #4b5563;
}

.sample-meta strong {
  color: #111827;
}

.sample-meta code {
  padding: 0.15rem 0.35rem;
  border-radius: 3px;
  background: #eef2f7;
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
}

.sample-text {
  font-size: 1.25rem;
  line-height: 1.45;
  color: #111827;
}

.sample-text-secondary {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  color: #6b7280;
}

.uppercase-sample {
  margin-top: 0.6rem;
}

.sample-divider {
  padding: 0.2rem;
  border-block: 1px solid #e5e7eb;
  background: #fff;
  font-family: var(--jjs-font-family-accent);
  font-size: 0.8rem;
  text-align: center;
  color: #9ca3af;
}

@media (max-width: 560px) {
  .compare-header {
    display: block;
  }

  .compare-header p {
    margin-top: 0.75rem;
  }
}
</style>
