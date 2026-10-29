<template>
  <div
    class="demo"
    :class="{ 'override-off': !overrideEnabled }"
  >
    <DemoHeader v-model="overrideEnabled" />

    <main class="showcase">
      <UppercaseDemo />

      <FontCard
        label="Body"
        name="Gotham Book"
        font-class="base"
      />
      <FontCard
        label="Accent"
        name="Gotham Medium"
        font-class="accent"
      />
      <FontCard
        label="Bold"
        name="Gotham Bold"
        font-class="bold"
      />
      <FontCard
        label="Title"
        name="Blacker Pro Display"
        font-class="title"
      />
      <FontCard
        label="Title Thin"
        name="Blacker Pro Light"
        font-class="title-thin"
      />
    </main>

    <DemoFooter />
  </div>
</template>

<script setup lang="ts">
import { useCookie } from '#imports'

const overrideEnabled = useCookie('metric-override', { default: () => true })
</script>
