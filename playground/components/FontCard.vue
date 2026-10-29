<template>
  <section class="card">
    <div class="card-header">
      <span class="card-label">{{ label }}</span>
      <span class="card-name">{{ name }}</span>
    </div>
    <p
      class="card-sample"
      :class="fontClass"
    >
      The quick brown fox jumps over the lazy dog.
      <small>0123456789 — !@#$%^&*()</small>
    </p>
    <div class="card-sizes">
      <span
        class="size-sm"
        :class="fontClass"
      >12px</span>
      <span
        class="size-md"
        :class="fontClass"
      >16px</span>
      <span
        class="size-lg"
        :class="fontClass"
      >24px</span>
      <span
        class="size-xl"
        :class="fontClass"
      >32px</span>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  name: string
  fontClass: string
}>()
</script>

<style scoped lang="scss">
.card {
  padding: 1.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  transition: border-color 0.2s;
}
.card:hover {
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
  text-transform: uppercase;
  color: #fff;
}
.card-name {
  font-family: var(--jjs-font-family-base);
  font-size: 0.85rem;
  color: #6b7280;
}
.card-sample {
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.card-sample small {
  display: block;
  margin-top: 0.35rem;
  opacity: 0.45;
  font-size: 0.75em;
}
.card-sizes {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 1rem;
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
</style>
