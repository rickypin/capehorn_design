import { defineStore } from "pinia"
import type { MonitorCardData } from "@/components/shared/MonitorCard.vue"
import { $fetch } from "ofetch" // Declare the $fetch variable

export interface MonitorsState {
  monitors: MonitorCardData[]
  selectedMonitor: MonitorCardData | null
  loading: boolean
  error: string | null
}

export const useMonitorsStore = defineStore("monitors", {
  state: (): MonitorsState => ({
    monitors: [],
    selectedMonitor: null,
    loading: false,
    error: null,
  }),

  getters: {
    getAllMonitors: (state) => state.monitors,
    getActiveMonitors: (state) => state.monitors.filter((m) => m.status === "active"),
    getMonitorById: (state) => (id: string) => state.monitors.find((m) => m.id === id),
    getMonitorsByType: (state) => (type: "network" | "transaction") => state.monitors.filter((m) => m.type === type),
    getTestMonitors: (state) => state.monitors.filter((m) => m.id.startsWith("test-")),
    getProductionMonitors: (state) => state.monitors.filter((m) => !m.id.startsWith("test-")),
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    setMonitors(monitors: MonitorCardData[]) {
      this.monitors = monitors
    },

    addMonitor(monitor: MonitorCardData) {
      this.monitors.push(monitor)
    },

    updateMonitor(id: string, updates: Partial<MonitorCardData>) {
      const index = this.monitors.findIndex((m) => m.id === id)
      if (index !== -1) {
        this.monitors[index] = { ...this.monitors[index], ...updates }
      }
    },

    removeMonitor(id: string) {
      const index = this.monitors.findIndex((m) => m.id === id)
      if (index !== -1) {
        this.monitors.splice(index, 1)
      }
    },

    selectMonitor(monitor: MonitorCardData | null) {
      this.selectedMonitor = monitor
    },

    // Initialize with sample data
    initializeSampleData() {
      const sampleMonitors: MonitorCardData[] = [
        {
          id: "1",
          name: "VISA Service",
          status: "active",
          lastUpdated: "2 minutes ago",
          route: "visa_service",
          type: "network",
          showMetrics: true,
          iconType: "credit-card",
          statusColor: "green",
        },
        {
          id: "2",
          name: "VISA Service (Intermediate)",
          status: "active",
          lastUpdated: "5 minutes ago",
          route: "visa_service_intermediate",
          type: "transaction",
          showMetrics: true,
          iconType: "credit-card",
          statusColor: "green",
        },
        {
          id: "test-3",
          name: "[TEST] Payment Gateway Service",
          status: "active",
          lastUpdated: "1 minute ago",
          route: "payment_gateway_test",
          type: "network",
          showMetrics: true,
          iconType: "zap",
          statusColor: "green",
          description: "Gradient Area - Traffic Flow",
          chartType: "gradient-area",
          dataPattern: "sawtooth",
          chartStyle: {
            strokeWidth: 3,
            opacity: 0.8,
            glow: true,
          },
        },
        {
          id: "test-4",
          name: "[TEST] Auth Service",
          status: "warning",
          lastUpdated: "3 minutes ago",
          route: "auth_service_test",
          type: "transaction",
          showMetrics: true,
          iconType: "shield",
          statusColor: "orange",
          description: "Multi-Line - Performance Metrics",
          chartType: "multi-line",
          dataPattern: "heartbeat",
          chartStyle: {
            strokeWidth: 2,
            opacity: 0.9,
          },
        },
      ]
      this.setMonitors(sampleMonitors)
    },

    // Async actions for API calls
    async fetchMonitors() {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch("/api/monitors")
        this.setMonitors(response.data)
      } catch (error) {
        this.setError(error instanceof Error ? error.message : "Failed to fetch monitors")
        // Fallback to sample data if API fails
        this.initializeSampleData()
      } finally {
        this.setLoading(false)
      }
    },

    async createMonitor(monitorData: Omit<MonitorCardData, "id">) {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch("/api/monitors", {
          method: "POST",
          body: monitorData,
        })

        this.addMonitor(response.data)
        return response.data
      } catch (error) {
        this.setError(error instanceof Error ? error.message : "Failed to create monitor")
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async updateMonitor(id: string, updates: Partial<MonitorCardData>) {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch(`/api/monitors/${id}`, {
          method: "PUT",
          body: updates,
        })

        const index = this.monitors.findIndex((m) => m.id === id)
        if (index !== -1) {
          this.monitors[index] = response.data
        }
        return response.data
      } catch (error) {
        this.setError(error instanceof Error ? error.message : "Failed to update monitor")
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async deleteMonitor(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        await $fetch(`/api/monitors/${id}`, {
          method: "DELETE",
        })

        const index = this.monitors.findIndex((m) => m.id === id)
        if (index !== -1) {
          this.monitors.splice(index, 1)
        }
      } catch (error) {
        this.setError(error instanceof Error ? error.message : "Failed to delete monitor")
        throw error
      } finally {
        this.setLoading(false)
      }
    },
  },
})
