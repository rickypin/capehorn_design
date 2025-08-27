import { defineNuxtConfig } from "nuxt"

export default defineNuxtConfig({
  devtools: { enabled: true },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // CSS framework
  css: ["~/assets/css/main.css"],

  // Modules
  modules: ["@nuxt/ui", "@pinia/nuxt", "@vueuse/nuxt", "shadcn-nuxt", "@nuxt/eslint"],

  // shadcn-vue configuration
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config.ts",
  },

  // App configuration
  app: {
    head: {
      title: "Capehorn Monitor - Network & Transaction Monitoring Platform",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Comprehensive network and transaction monitoring platform for real-time performance insights, health indicators, and proactive issue detection.",
        },
        {
          name: "keywords",
          content:
            "network monitoring, transaction monitoring, performance analytics, system health, uptime monitoring, real-time metrics",
        },
      ],
    },
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    // Public keys (exposed to client-side)
    public: {
      apiBase: "/api",
    },
  },

  // Build configuration
  build: {
    transpile: ["lucide-vue-next"],
  },

  // Vite configuration
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },
})
