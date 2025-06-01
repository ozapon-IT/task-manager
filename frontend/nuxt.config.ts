// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

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

  css: ['~/assets/css/tailwind.css'],

  modules: [
    "@nuxtjs/tailwindcss",
  ],
});