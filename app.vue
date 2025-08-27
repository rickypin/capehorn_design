<template>
  <!-- Creating main Nuxt 3 app template with Vue 3 composition API -->
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Importing useHead from the appropriate module
import { useHead } from '#app';

// Using useHead at the top level of the script
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>
