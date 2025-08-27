<template>
  <!-- Converting complex React MonitorCard component to Vue 3 with charts -->
  <Card
    :class="`hover:shadow-lg transition-all duration-200 hover:border-primary/50 monitor-card-size overflow-visible ${isTestCard ? 'border-dashed border-amber-200 bg-amber-50/20' : ''} ${className}`"
    @click="handleCardClick"
  >
    <CardContent class="flex flex-col h-full p-3 relative">
      <!-- Test Card Badge -->
      <div
        v-if="isTestCard"
        class="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-amber-600 text-[10px] font-medium uppercase tracking-wide opacity-60"
      >
        TEST
      </div>

      <!-- Enhanced Card with Metrics -->
      <template v-if="monitorData.showMetrics && monitorData.type && chartData.length > 0 && healthIndicator">
        <!-- Header with Icon and Title -->
        <div class="flex items-start gap-3 mb-2">
          <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${getIconStyleClass()}`">
            <component :is="getMonitorIcon()" class="h-6 w-6" />
          </div>
          <div class="flex-1 min-w-0">
            <FadeTitle class="font-medium text-foreground text-sm mb-1" :title="monitorData.name" />
            <!-- Health Indicator -->
            <div class="flex items-center">
              <div :class="`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${healthIndicator.bgColor} ${healthIndicator.color}`">
                <span class="text-[10px] font-semibold tracking-wide uppercase opacity-75 mr-1">
                  {{ healthIndicator.label }}
                </span>
                <span class="font-bold">
                  {{ healthIndicator.value.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Time Series Chart -->
        <div class="flex-1 mb-1 relative">
          <div class="h-24 w-full bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg p-2 overflow-visible">
            <div v-if="isClient" class="w-full h-full">
              <component :is="chartComponent" v-bind="chartProps" />
            </div>
            <div v-else class="flex items-center justify-center h-full bg-muted/30 rounded">
              <Activity class="h-4 w-4 text-muted-foreground animate-pulse" />
            </div>
          </div>
        </div>

        <!-- Metrics Summary -->
        <div class="text-xs">
          <div v-if="monitorData.type === 'network'" class="flex justify-between items-center">
            <span class="text-muted-foreground flex items-center gap-1">
              <Activity class="h-3 w-3" />
              Network Traffic
            </span>
            <span class="font-medium text-foreground bg-muted/50 px-2 py-0.5 rounded">
              Last 15min
            </span>
          </div>
          <div v-else class="flex justify-between items-center">
            <span class="text-muted-foreground flex items-center gap-1">
              <TrendingUp class="h-3 w-3" />
              Transaction Volume
            </span>
            <span class="font-medium text-foreground bg-muted/50 px-2 py-0.5 rounded">
              Last 15min
            </span>
          </div>
        </div>
      </template>

      <!-- Simple Card Fallback -->
      <template v-else>
        <div class="flex items-center gap-3 mb-3">
          <div :class="`w-12 h-12 rounded-lg flex items-center justify-center ${getIconStyleClass()}`">
            <component :is="getMonitorIcon()" class="h-6 w-6" />
          </div>
          <div class="flex-1 min-w-0">
            <FadeTitle class="font-medium text-foreground" :title="monitorData.name" />
          </div>
        </div>
        <div class="flex-1">
          <p class="text-xs text-muted-foreground">
            {{ monitorData.description || (monitorData.lastUpdated ? `Updated ${monitorData.lastUpdated}` : '') }}
          </p>
        </div>
      </template>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import {
  MonitorIcon,
  Activity,
  TrendingUp,
  CreditCard,
  Database,
  Server,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  HardDrive,
  Network,
  BarChart3,
  Cpu,
  Cloud,
  Lock
} from 'lucide-vue-next'
import FadeTitle from './FadeTitle.vue'
import { useClientOnly } from '@/composables/useClientOnly'

// Async chart components for better performance
const LineChart = defineAsyncComponent(() => import('@/components/charts/LineChart.vue'))
const AreaChart = defineAsyncComponent(() => import('@/components/charts/AreaChart.vue'))
const BarChart = defineAsyncComponent(() => import('@/components/charts/BarChart.vue'))
const ScatterChart = defineAsyncComponent(() => import('@/components/charts/ScatterChart.vue'))
const ComposedChart = defineAsyncComponent(() => import('@/components/charts/ComposedChart.vue'))

export type ChartType = 'area' | 'line' | 'bar' | 'scatter' | 'composed' | 'step' |
  'gradient-area' | 'multi-line' | 'stacked-bar' | 'bubble' | 'heatmap' | 'radial' |
  'waterfall' | 'candlestick' | 'pulse-wave'

export interface MonitorCardData {
  id: string
  name: string
  status: string
  lastUpdated?: string
  description?: string
  route?: string
  iconColor?: string
  statusColor?: string
  type?: 'network' | 'transaction'
  showMetrics?: boolean
  chartType?: ChartType
  dataPattern?: any
  iconType?: string
  chartColors?: {
    primary?: string
    secondary?: string
    accent?: string
    gradient?: string[]
  }
  chartStyle?: {
    strokeWidth?: number
    opacity?: number
    animation?: boolean
    glow?: boolean
  }
}

interface MonitorCardConfig {
  showPreview?: boolean
  showMetrics?: boolean
  interactive?: boolean
}

interface MonitorCardProps {
  data?: MonitorCardData
  config?: MonitorCardConfig
  onSelect?: (data: MonitorCardData) => void
  onNavigate?: (route: string) => void
  className?: string
  // Legacy props
  monitor?: MonitorCardData
  onClick?: (monitor: MonitorCardData) => void
  showPreview?: boolean
}

const props = withDefaults(defineProps<MonitorCardProps>(), {
  className: '',
  showPreview: false
})

const emit = defineEmits<{
  select: [data: MonitorCardData]
  navigate: [route: string]
  click: [monitor: MonitorCardData]
}>()

const { isClient } = useClientOnly()

// Support both new and legacy interfaces
const monitorData = computed(() => props.data || props.monitor)
const cardConfig = computed(() => props.config || {})
const shouldShowPreview = computed(() => cardConfig.value.showPreview ?? props.showPreview)
const isTestCard = computed(() => 
  monitorData.value?.id.startsWith('test-') || monitorData.value?.name.includes('[TEST]')
)

// Mock data generation functions (simplified for Vue)
const generateMockData = (type: 'network' | 'transaction') => {
  const data = []
  for (let i = 0; i < 15; i++) {
    if (type === 'network') {
      data.push({
        time: `${i}m`,
        inMbps: Math.random() * 100 + 20,
        outMbps: Math.random() * 80 + 15,
        rtt: Math.random() * 50 + 10,
        loss: Math.random() * 5
      })
    } else {
      data.push({
        time: `${i}m`,
        req: Math.random() * 1000 + 100,
        successRate: Math.random() * 20 + 80,
        responseTime: Math.random() * 200 + 50,
        errorRate: Math.random() * 10
      })
    }
  }
  return data
}

const calculateHealthIndicator = (data: any[], type: 'network' | 'transaction') => {
  if (!data.length) return null
  
  const value = type === 'network' 
    ? Math.random() * 40 + 60  // NHI simulation
    : Math.random() * 30 + 70  // THI simulation
    
  const getHealthColor = (val: number) => {
    if (val >= 80) return 'text-green-700'
    if (val >= 60) return 'text-yellow-700'
    return 'text-red-700'
  }
  
  const getHealthBgColor = (val: number) => {
    if (val >= 80) return 'bg-green-100'
    if (val >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }
  
  return {
    value,
    label: type === 'network' ? 'NHI' : 'THI',
    color: getHealthColor(value),
    bgColor: getHealthBgColor(value)
  }
}

const chartData = computed(() => {
  if (!isClient.value || !monitorData.value?.showMetrics || !monitorData.value?.type) return []
  return generateMockData(monitorData.value.type)
})

const healthIndicator = computed(() => {
  if (!chartData.value.length || !monitorData.value?.type) return null
  return calculateHealthIndicator(chartData.value, monitorData.value.type)
})

const getMonitorIcon = () => {
  if (!monitorData.value) return MonitorIcon
  
  const iconType = monitorData.value.iconType
  if (iconType) {
    const iconMap: Record<string, any> = {
      'credit-card': CreditCard,
      'database': Database,
      'server': Server,
      'zap': Zap,
      'shield': Shield,
      'globe': Globe,
      'message': MessageSquare,
      'storage': HardDrive,
      'network': Network,
      'chart': BarChart3,
      'cpu': Cpu,
      'cloud': Cloud,
      'lock': Lock,
      'activity': Activity
    }
    return iconMap[iconType] || MonitorIcon
  }
  
  // Auto-detect based on monitor name
  const name = monitorData.value.name.toLowerCase()
  if (name.includes('visa') || name.includes('payment')) return CreditCard
  if (name.includes('database') || name.includes('db')) return Database
  if (name.includes('api') || name.includes('service')) return Server
  if (name.includes('auth') || name.includes('security')) return Shield
  if (name.includes('network') || name.includes('cdn')) return Network
  
  return MonitorIcon
}

const getIconStyleClass = () => {
  return 'bg-slate-50 text-slate-700 border border-slate-200 icon-texture-diagonal'
}

const chartComponent = computed(() => {
  const chartType = monitorData.value?.chartType || (monitorData.value?.type === 'network' ? 'area' : 'line')
  
  switch (chartType) {
    case 'area':
    case 'gradient-area':
      return AreaChart
    case 'line':
    case 'step':
    case 'multi-line':
      return LineChart
    case 'bar':
    case 'stacked-bar':
      return BarChart
    case 'scatter':
    case 'bubble':
      return ScatterChart
    case 'composed':
    case 'candlestick':
    case 'pulse-wave':
      return ComposedChart
    default:
      return LineChart
  }
})

const chartProps = computed(() => {
  const chartType = monitorData.value?.chartType || 'line'
  const colors = monitorData.value?.chartColors || {
    primary: '#0891b2',
    secondary: '#0ea5e9',
    accent: '#06b6d4'
  }
  
  return {
    data: chartData.value,
    chartType,
    colors,
    style: monitorData.value?.chartStyle || { strokeWidth: 2, opacity: 1 }
  }
})

const handleCardClick = () => {
  if (!monitorData.value) return
  
  // New unified interface
  if (props.onSelect) {
    props.onSelect(monitorData.value)
  }
  emit('select', monitorData.value)
  
  // Legacy interface support
  if (props.onClick) {
    props.onClick(monitorData.value)
  }
  emit('click', monitorData.value)
  
  // Handle navigation
  if (monitorData.value.route) {
    if (props.onNavigate) {
      props.onNavigate(`/monitor/${monitorData.value.route}`)
    } else {
      emit('navigate', `/monitor/${monitorData.value.route}`)
    }
  }
}
</script>
