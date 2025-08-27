<template>
  <!-- Converting React FadeTitle component to Vue 3 -->
  <div class="relative overflow-hidden">
    <h1
      :class="`text-singleline-fade ${className}`"
      :title="title"
    >
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
interface FadeTitleProps {
  title: string
  className?: string
}

withDefaults(defineProps<FadeTitleProps>(), {
  className: 'text-lg font-semibold text-foreground'
})
</script>
