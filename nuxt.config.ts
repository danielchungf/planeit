// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/assets/portrait2.png' }
      ]
    }
  }
})