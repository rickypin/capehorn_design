<template>
  <!-- Simple Area Chart component for Vue 3 -->
  <div class="w-full h-full">
    <svg :width="width" :height="height" class="overflow-visible">
      <defs>
        <linearGradient :id="`area-gradient-${chartId}`" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="colors.primary" stop-opacity="0.4" />
          <stop offset="100%" :stop-color="colors.primary" stop-opacity="0.1" />
        </linearGradient>
      </defs>
      
      <!-- Area Fill -->
      <path
        :d="areaPath"
        :fill="`url(#area-gradient-${chartId})`"
        class="transition-all duration-300"
      />
      
      <!-- Line -->
      <path
        :d="linePath"
        :stroke="colors.primary"
        :stroke-width="style.strokeWidth || 2"
        fill="none"
        class="transition-all duration-300"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface AreaChartProps {
  data: any[]
  chartType?: string
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
  }
  style?: {
    strokeWidth?: number
    opacity?: number
  }
  width?: number
  height?: number
}

const props = withDefaults(defineProps<AreaChartProps>(), {
  colors: () => ({ primary: '#0891b2', secondary: '#0ea5e9', accent: '#06b6d4' }),
  style: () => ({ strokeWidth: 2, opacity: 1 }),
  width: 300,
  height: 80
})

const chartId = computed(() => Math.random().toString(36).substr(2, 9))

const points = computed(() => {
  if (!props.data.length) return []
  
  const dataKey = props.data[0].hasOwnProperty('req') ? 'req' : 'inMbps'
  const maxValue = Math.max(...props.data.map(d => d[dataKey]))
  const minValue = Math.min(...props.data.map(d => d[dataKey]))
  const range = maxValue - minValue || 1
  
  return props.data.map((item, index) => ({
    x: (index / (props.data.length - 1)) * (props.width - 20) + 10,
    y: props.height - 10 - ((item[dataKey] - minValue) / range) * (props.height - 20),
    value: item[dataKey]
  }))
})

const linePath = computed(() => {
  if (!points.value.length) return ''
  
  let path = `M ${points.value[0].x} ${points.value[0].y}`
  for (let i = 1; i < points.value.length; i++) {
    path += ` L ${points.value[i].x} ${points.value[i].y}`
  }
  return path
})

const areaPath = computed(() => {
  if (!points.value.length) return ''
  
  let path = `M ${points.value[0].x} ${props.height - 10}`
  path += ` L ${points.value[0].x} ${points.value[0].y}`
  
  for (let i = 1; i < points.value.length; i++) {
    path += ` L ${points.value[i].x} ${points.value[i].y}`
  }
  
  path += ` L ${points.value[points.value.length - 1].x} ${props.height - 10}`
  path += ' Z'
  
  return path
})
</script>
