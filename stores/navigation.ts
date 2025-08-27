import { defineStore } from "pinia"

export interface NavigationState {
  activeNavItem: string
  breadcrumbs: BreadcrumbItem[]
}

export interface BreadcrumbItem {
  id?: string
  label: string
  href?: string
  isActive?: boolean
  icon?: any
}

export const useNavigationStore = defineStore("navigation", {
  state: (): NavigationState => ({
    activeNavItem: "Home",
    breadcrumbs: [],
  }),

  getters: {
    getCurrentNavItem: (state) => state.activeNavItem,
    getBreadcrumbs: (state) => state.breadcrumbs,
    isNavItemActive: (state) => (item: string) => state.activeNavItem === item,
  },

  actions: {
    setActiveNavItem(item: string) {
      this.activeNavItem = item
    },

    setBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
      this.breadcrumbs = breadcrumbs
    },

    addBreadcrumb(breadcrumb: BreadcrumbItem) {
      this.breadcrumbs.push(breadcrumb)
    },

    clearBreadcrumbs() {
      this.breadcrumbs = []
    },

    navigateToPage(navItem: string, breadcrumbs: BreadcrumbItem[] = []) {
      this.setActiveNavItem(navItem)
      this.setBreadcrumbs(breadcrumbs)
    },
  },
})
