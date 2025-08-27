<template>
  <!-- Vue 3 Card component equivalent to React shadcn/ui Card -->
  <div :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/utils/cn'

interface CardProps {
  className?: string
}

withDefaults(defineProps<CardProps>(), {
  className: ''
})
</script>

<template name="CardContent">
  <div :class="cn('p-6', className)" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts" name="CardContent">
import { cn } from '@/utils/cn'

interface CardContentProps {
  className?: string
}

withDefaults(defineProps<CardContentProps>(), {
  className: ''
})
</script>
