import { defineStore } from "pinia"

export interface UIState {
  theme: "light" | "dark" | "system"
  sidebarCollapsed: boolean
  previewMode: boolean
  chatPanelOpen: boolean
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export const useUIStore = defineStore("ui", {
  state: (): UIState => ({
    theme: "system",
    sidebarCollapsed: false,
    previewMode: false,
    chatPanelOpen: false,
    notifications: [],
  }),

  getters: {
    getCurrentTheme: (state) => state.theme,
    isSidebarCollapsed: (state) => state.sidebarCollapsed,
    isPreviewMode: (state) => state.previewMode,
    isChatPanelOpen: (state) => state.chatPanelOpen,
    getNotifications: (state) => state.notifications,
    getUnreadNotifications: (state) => state.notifications.filter((n) => !n.read),
    getUnreadCount: (state) => state.notifications.filter((n) => !n.read).length,
  },

  actions: {
    setTheme(theme: "light" | "dark" | "system") {
      this.theme = theme
      // In a real app, you might want to persist this to localStorage
      if (process.client) {
        localStorage.setItem("theme", theme)
      }
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
    },

    setPreviewMode(enabled: boolean) {
      this.previewMode = enabled
    },

    togglePreviewMode() {
      this.previewMode = !this.previewMode
    },

    setChatPanelOpen(open: boolean) {
      this.chatPanelOpen = open
    },

    toggleChatPanel() {
      this.chatPanelOpen = !this.chatPanelOpen
    },

    addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">) {
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}`,
        timestamp: new Date(),
        read: false,
      }
      this.notifications.unshift(newNotification)
    },

    markNotificationAsRead(id: string) {
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.read = true
      }
    },

    markAllNotificationsAsRead() {
      this.notifications.forEach((n) => (n.read = true))
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },

    clearAllNotifications() {
      this.notifications = []
    },

    // Initialize theme from localStorage
    initializeTheme() {
      if (process.client) {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null
        if (savedTheme) {
          this.theme = savedTheme
        }
      }
    },
  },
})
