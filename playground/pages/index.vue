<template>
  <div class="demo" :class="{ 'override-off': !overrideEnabled }">
    <NuxtLink class="compare-link" to="/font-compare">
      Open web font vs fallback comparison →
    </NuxtLink>
    <DemoHeader v-model="overrideEnabled" />
    <main class="showcase">
      <UppercaseDemo />
      <FontCard label="Body" name="Gotham Book" font-class="base" />
      <FontCard label="Accent" name="Gotham Medium" font-class="accent" />
      <FontCard label="Bold" name="Gotham Bold" font-class="bold" />
      <FontCard label="Title" name="Blacker Pro Display" font-class="title" />
      <FontCard label="Title Thin" name="Blacker Pro Light" font-class="title-thin" />
    </main>
    <DemoFooter />
  </div>
</template>

<script setup lang="ts">
import { useCookie } from '#imports'

const overrideEnabled = useCookie('metric-override', { default: () => true })
</script>

<style scoped>
.compare-link {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  z-index: 1;
  padding: 0.45rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(13, 17, 23, 0.8);
  font-family: var(--jjs-font-family-base);
  font-size: 0.75rem;
  color: #e6edf3;
  text-decoration: none;
}

.compare-link:hover {
  background: #238636;
}
</style>
