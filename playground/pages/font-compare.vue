<template>
  <div class="demo">
    <header class="compare-page-header">
      <NuxtLink to="/">← Back to playground</NuxtLink>
      <h1>Web font vs fallback</h1>
      <p>Compare the rendered web font with its metric-adjusted fallback.</p>
    </header>
    <main class="showcase">
      <FontCompare title="Gotham Book" web-font="GothamBook" fallback-font="GothamBookOverride" />
      <FontCompare title="Gotham Medium" web-font="GothamMedium" fallback-font="GothamMediumOverride" />
      <FontCompare title="Gotham Bold" web-font="GothamBold" fallback-font="GothamBoldOverride" />
      <FontCompare title="Blacker Pro Display" web-font="BlackerProDisplayRegular" fallback-font="BlackerProDisplayRegularOverride" />
      <FontCompare title="Blacker Pro Light" web-font="BlackerProDisplayLight" fallback-font="BlackerProDisplayLightOverride" />
    </main>
  </div>
</template>

<style scoped>
.compare-page-header { max-width: 900px; margin: 0 auto; padding: 3rem 1.5rem 0; }
.compare-page-header a { font-family: var(--jjs-font-family-base); font-size: 0.85rem; color: #17663b; text-decoration: none; }
.compare-page-header h1 { margin-top: 1.5rem; font-family: var(--jjs-font-family-title); font-size: clamp(2rem, 5vw, 3rem); font-weight: 400; }
.compare-page-header p { margin-top: 0.5rem; font-family: var(--jjs-font-family-base); color: #6b7280; }
</style>
