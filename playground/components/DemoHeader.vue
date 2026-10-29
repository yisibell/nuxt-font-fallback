<template>
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
        :class="{ active: modelValue }"
        @click="$emit('update:modelValue', !modelValue)"
      >
        <span class="toggle-knob" />
      </button>
      <span class="toggle-label">
        Metric Override <strong>{{ modelValue ? 'ON' : 'OFF' }}</strong>
      </span>
    </div>

    <p class="hero-hint">
      {{ modelValue
        ? 'Fallback font metrics match the web font. No layout shift when fonts load.'
        : 'Browser uses default fallback. Refresh with cache disabled to see the shift.'
      }}
    </p>

    <div class="hero-badge">
      <span class="badge">@nuxt/kit</span>
      <span class="badge">fontaine</span>
      <span class="badge">CLS ≈ {{ modelValue ? '0.0001' : '0.1' }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped lang="scss">
.hero {
  padding: 4rem 2rem 3rem;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  color: #e6edf3;
  text-align: center;
}

.hero-title {
  margin-bottom: 1rem;
  font-family: var(--jjs-font-family-title);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 400;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  max-width: 560px;
  margin: 0 auto 1.5rem;
  font-family: var(--jjs-font-family-base);
  font-size: 1.1rem;
  line-height: 1.7;
  color: #8b949e;
}

.hero-subtitle code {
  padding: 0.15em 0.4em;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: #e6edf3;
  font-size: 0.9em;
}

.toggle-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.toggle {
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 26px;
  border: 0;
  border-radius: 100px;
  background: #30363d;
  cursor: pointer;
  transition: background 0.25s;
}
.toggle.active {
  background: #238636;
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
}
.toggle.active .toggle-knob {
  transform: translateX(18px);
}
.toggle-label {
  font-family: var(--jjs-font-family-base);
  font-size: 0.95rem;
  color: #c9d1d9;
}
.toggle-label strong {
  display: inline-block;
  min-width: 2.5em;
  font-family: var(--jjs-font-family-accent);
  color: #e6edf3;
  text-align: left;
}
.hero-hint {
  max-width: 480px;
  min-height: 2.55em;
  margin: 0 auto 1.25rem;
  font-family: var(--jjs-font-family-base);
  font-size: 0.85rem;
  line-height: 1.5;
  color: #6e7681;
}
.hero-badge {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}
.badge {
  padding: 0.3em 0.75em;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  font-family: var(--jjs-font-family-accent);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: #8b949e;
}
</style>
