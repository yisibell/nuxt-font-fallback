<template>
  <section class="card uppercase-demo">
    <div class="card-header">
      <span class="card-label">Uppercase</span>
      <span class="card-name">Uppercase text preview</span>
      <button
        class="base-toggle"
        type="button"
        :aria-pressed="showBase"
        @click="toggleBase"
      >
        <span
          class="toggle-indicator"
          :class="{ active: showBase }"
        />
        <span>Show base</span>
      </button>
    </div>

    <div class="uppercase-comparison">
      <div v-if="showBase">
        <span class="uppercase-column-label">Base</span>
        <p class="uppercase-sample uppercase-sample-base">
          <span
            v-for="word in words"
            :key="`base-${word}`"
            class="word-tag"
          >{{ word }}</span>
        </p>
      </div>

      <div>
        <span class="uppercase-column-label">Uppercase text</span>
        <p class="uppercase-sample uppercase-sample-uppercase">
          <span
            v-for="word in words"
            :key="`upper-${word}`"
            class="word-tag"
          >{{ word }}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCookie } from '#imports'

const words = [
  'Bridesmaid dresses',
  'Wedding dresses',
  'Mother of the bride dresses',
  'Prom dresses',
  'Evening dresses',
  'Cocktail dresses',
  'Party dresses',
  'Junior bridesmaid dresses',
  'Flower girl dresses',
  'Homecoming dresses',
  'Maternity wedding dresses',
  'Maternity bridesmaid dresses',
  'Maternity wedding guest dresses',
]

const showBase = useCookie('uppercase-show-base', { default: () => true })

function toggleBase() {
  showBase.value = !showBase.value
  window.location.reload()
}
</script>

<style scoped lang="scss">
.uppercase-demo {
  padding: 1.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  transition: border-color 0.2s;
}

.uppercase-demo:hover {
  border-color: #c4c8cf;
}

.card-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
.card-label {
  padding: 0.25em 0.6em;
  border-radius: 4px;
  background: #0d1117;
  font-family: var(--jjs-font-family-accent);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #fff;
}
.card-name {
  font-family: var(--jjs-font-family-base);
  font-size: 0.85rem;
  color: #6b7280;
}

.base-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
}

.toggle-indicator {
  width: 1.9rem;
  height: 1rem;
  border-radius: 999px;
  background: #d1d5db;
  transition: background 0.2s;
}

.toggle-indicator::after {
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  margin: 0.125rem;
  border-radius: 50%;
  background: #fff;
  content: '';
  transition: transform 0.2s;
}

.toggle-indicator.active {
  background: #238636;
}

.toggle-indicator.active::after {
  transform: translateX(0.9rem);
}

.uppercase-comparison {
  display: grid;
  gap: 1rem;
}

.uppercase-column-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.uppercase-sample {
  margin-bottom: 0.75rem;
  line-height: 1.35;
}

.word-tag {
  display: inline-block;
  margin: 0 0.35rem 0.35rem 0;
  padding: 0.45rem 0.7rem;
  background: #f7f3eb;
  font-family: inherit;
  color: #7f2f1c;
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.uppercase-sample-base {
  font-family: var(--jjs-font-family-base);
}

.uppercase-sample-uppercase {
  font-family: var(--jjs-font-family-base);
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .uppercase-comparison {
    gap: 1rem;
  }
}
</style>
