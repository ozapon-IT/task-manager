// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },

  vite: {
    server: {
      hmr: {
        protocol: "ws",
        host: "localhost",
        port: 3000,
        clientPort: 3000,
      },
    },
  },

  css: ['~/assets/css/main.css'],

  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    dataValue: 'theme'
  },
});