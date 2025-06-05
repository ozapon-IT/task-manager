<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html, body {
  scroll-behavior: smooth;
}

html[data-theme="dark"] {
  color-scheme: dark;
}

html[data-theme="light"] {
  color-scheme: light;
}

.stat {
  border-inline-end: none !important;
  border-block-end: none !important;
}
</style>