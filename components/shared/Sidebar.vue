<template>
  <!-- Converting React Sidebar component to Vue 3 with Composition API -->
  <div :class="`w-12 flex flex-col bg-card border-r border-border fixed left-0 top-0 h-full z-30 ${className}`">
    <!-- Navigation Items -->
    <div class="flex flex-col items-center py-3 space-y-2">
      <Button
        v-for="item in sidebarItems"
        :key="item.id"
        variant="ghost"
        size="sm"
        :disabled="item.isDisabled"
        :class="`h-9 w-9 p-0 transition-colors duration-150 ${
          currentActiveItem === item.id
            ? 'text-primary bg-muted/50 hover:bg-muted/70'
            : item.isDisabled
            ? 'text-muted-foreground/50 cursor-not-allowed'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer'
        }`"
        :title="item.label"
        @click="handleItemClick(item)"
      >
        <component :is="item.icon" class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Home, BarChart3, Monitor as MonitorIcon, Settings, Layers } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface SidebarItem {
  id: string
  label: string
  icon: Component
  href?: string
  isActive?: boolean
  isDisabled?: boolean
}

interface SidebarProps {
  // New unified interface
  items?: SidebarItem[]
  activeItem?: string
  onItemSelect?: (item: SidebarItem) => void
  onNavigate?: (href: string) => void
  className?: string

  // Legacy interface (deprecated but maintained for backward compatibility)
  /** @deprecated Use items and onItemSelect instead */
  activeNavItem?: string
  /** @deprecated Use items and onItemSelect instead */
  onNavItemChange?: (item: string) => void
}

const props = withDefaults(defineProps<SidebarProps>(), {
  className: '',
  activeNavItem: 'Monitor'
})

const emit = defineEmits<{
  itemSelect: [item: SidebarItem]
  navigate: [href: string]
  navItemChange: [item: string]
}>()

const router = useRouter()

const defaultItems = computed<SidebarItem[]>(() => [
  {
    id: 'Home',
    label: 'Home',
    icon: Home,
    href: '/'
  },
  {
    id: 'Analytics',
    label: 'Analytics',
    icon: BarChart3,
    isDisabled: true
  },
  {
    id: 'Monitor',
    label: 'Monitor',
    icon: MonitorIcon,
    href: '/monitor'
  },
  {
    id: 'CardDemo',
    label: 'Card Demo',
    icon: Layers,
    href: '/card-demo'
  },
  {
    id: 'Settings',
    label: 'Settings',
    icon: Settings,
    isDisabled: true
  }
])

const sidebarItems = computed(() => props.items || defaultItems.value)
const currentActiveItem = computed(() => props.activeItem || props.activeNavItem)

const handleItemClick = (item: SidebarItem) => {
  if (item.isDisabled) return

  // New unified interface
  if (props.onItemSelect) {
    props.onItemSelect(item)
  }
  emit('itemSelect', item)

  // Legacy interface support
  if (props.onNavItemChange) {
    props.onNavItemChange(item.id)
  }
  emit('navItemChange', item.id)

  // Handle navigation
  if (item.href) {
    if (props.onNavigate) {
      props.onNavigate(item.href)
    } else {
      emit('navigate', item.href)
      // Default navigation behavior
      router.push(item.href)
    }
  }
}
</script>
