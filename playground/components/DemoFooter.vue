<template>
  <footer class="info">
    <p>
      Toggle <strong>Disable cache</strong> in DevTools and reload to see the fallback
      font before the web font loads. With metric overrides, there is zero layout shift.
    </p>
  </footer>
</template>

<style scoped lang="scss">
.info {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  text-align: center;
}
.info p {
  font-family: var(--jjs-font-family-base);
  font-size: 0.9rem;
  line-height: 1.7;
  color: #6b7280;
}
.info strong {
  font-family: var(--jjs-font-family-accent);
  color: #374151;
}
</style>
