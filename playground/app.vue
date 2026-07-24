<template>
  <div class="demo">
    <h1 class="demo-title">nuxt-font-metrics</h1>
    <p class="demo-base">GothamBook — The quick brown fox jumps over the lazy dog.</p>
    <p class="demo-accent">GothamMedium — The quick brown fox jumps over the lazy dog.</p>
    <p class="demo-bold">GothamBold — The quick brown fox jumps over the lazy dog.</p>
    <p class="demo-title">BlackerProRegular — The quick brown fox jumps over the lazy dog.</p>
    <p class="demo-title-thin">BlackerProLight — The quick brown fox jumps over the lazy dog.</p>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.demo {
  padding: 2rem;
  max-width: 720px;
  margin: 0 auto;
}
.demo-title {
  font-family: var(--jjs-font-family-title);
  font-size: 1.5rem;
  margin-bottom: 2rem;
}
.demo-base {
  font-family: var(--jjs-font-family-base);
}
.demo-accent {
  font-family: var(--jjs-font-family-accent);
}
.demo-bold {
  font-family: var(--jjs-font-family-accent-bold);
}
.demo-title {
  font-family: var(--jjs-font-family-title);
  font-size: 1.25rem;
}
.demo-title-thin {
  font-family: var(--jjs-font-family-title-thin);
  font-size: 1.25rem;
}
p {
  margin: 1rem 0;
  font-size: 1rem;
  line-height: 1.6;
}
</style>