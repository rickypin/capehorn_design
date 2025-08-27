<template>
  <!-- Converting React Breadcrumb component to Vue 3 with Composition API -->
  <div :class="`sticky top-0 z-20 bg-card border-b border-border ${className}`">
    <div class="px-6 py-3">
      <nav class="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
        <!-- Home Button -->
        <Button
          variant="ghost"
          size="sm"
          class="h-auto px-2 py-1 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors duration-150 rounded cursor-pointer"
          title="Home"
          @click="handleNavigation('/')"
        >
          <Home class="h-4 w-4" />
        </Button>

        <!-- Breadcrumb Items -->
        <div
          v-for="(item, index) in items"
          :key="item.id || `breadcrumb-${index}`"
          class="flex items-center space-x-2"
        >
          <span class="text-muted-foreground/70">/</span>
          <Button
            v-if="item.href && !item.isActive"
            variant="ghost"
            size="sm"
            class="h-auto px-2 py-1 text-foreground font-medium hover:text-primary hover:bg-muted/50 transition-colors duration-150 rounded cursor-pointer"
            @click="handleItemClick(item)"
          >
            <div class="flex items-center gap-1">
              <component v-if="item.icon" :is="item.icon" class="h-3 w-3" />
              {{ item.label }}
            </div>
          </Button>
          <span
            v-else
            :class="`font-medium px-2 py-1 cursor-default flex items-center gap-1 ${
              item.isActive ? 'text-primary' : 'text-muted-foreground'
            }`"
          >
            <component v-if="item.icon" :is="item.icon" class="h-3 w-3" />
            {{ item.label }}
          </span>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface BreadcrumbItem {
  id?: string
  label: string
  href?: string
  isActive?: boolean
  icon?: Component
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onItemClick?: (item: BreadcrumbItem) => void
  onNavigate?: (href: string) => void
  className?: string
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  className: ''
})

const emit = defineEmits<{
  itemClick: [item: BreadcrumbItem]
  navigate: [href: string]
}>()

const router = useRouter()

const handleNavigation = (href: string) => {
  // Default navigation behavior
  router.push(href)
  if (props.onNavigate) {
    props.onNavigate(href)
  } else {
    emit('navigate', href)
  }
}

const handleItemClick = (item: BreadcrumbItem) => {
  // Call the item click callback
  if (props.onItemClick) {
    props.onItemClick(item)
  }
  emit('itemClick', item)

  // Handle navigation if href is provided
  if (item.href) {
    handleNavigation(item.href)
  }
}
</script>
