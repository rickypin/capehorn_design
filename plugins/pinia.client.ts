import { defineNuxtPlugin } from "#app"
import { useUIStore } from "~/stores/ui"
import { useMonitorsStore } from "~/stores/monitors"

export default defineNuxtPlugin(() => {
  // Initialize stores on client side
  const uiStore = useUIStore()
  const monitorsStore = useMonitorsStore()

  if (process.client) {
    // Initialize theme from localStorage
    uiStore.initializeTheme()

    // Initialize sample monitor data
    monitorsStore.initializeSampleData()
  }
})
