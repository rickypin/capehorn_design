"use client"

import { Card, CardContent } from "@/components/ui/card"
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
} from "lucide-react"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"
import { useMemo, useEffect, useState } from "react"
import {
  generateMiniCardData,
  generateMiniCardDataWithPattern,
  calculateNHI,
  calculateTHI,
  getHealthColor,
  getHealthBgColor,
  type MonitorDataPoint,
  type DataPattern
} from "@/lib/monitor-data"
import { getChartColors, getMonitorTypeColors, getMetricInfo, getChartUIColors } from '@/lib/chart-colors'
import FadeTitle from "./FadeTitle"

export type ChartType = 'area' | 'line' | 'bar' | 'scatter' | 'composed' | 'step' |
  'gradient-area' | 'multi-line' | 'stacked-bar' | 'bubble' | 'heatmap' | 'radial' |
  'waterfall' | 'candlestick' | 'pulse-wave'

// Custom Tooltip Component for Monitor Cards
interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  chartType?: ChartType
  monitorType?: 'network' | 'transaction'
}

function CustomTooltip({ active, payload, label, chartType, monitorType }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  // Define metric labels and units based on monitor type and chart type
  // Now using design tokens from chart-colors utility
  const getMetricInfoLocal = (dataKey: string) => {
    return getMetricInfo(dataKey)
  }

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 min-w-[200px] max-w-[250px] z-50 relative">
      {label && (
        <div className="text-xs text-muted-foreground mb-2 font-medium">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const metricInfo = getMetricInfoLocal(entry.dataKey)
          const value = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value

          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded flex-shrink-0"
                  style={{ backgroundColor: entry.color || metricInfo.color }}
                />
                <span className="text-xs font-medium text-foreground truncate">
                  {metricInfo.label}
                </span>
              </div>
              <span className="text-xs font-bold text-foreground whitespace-nowrap">
                {value}{metricInfo.unit}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Common tooltip configuration for better positioning
const getTooltipConfig = (chartType: ChartType, monitorType: 'network' | 'transaction') => ({
  content: <CustomTooltip chartType={chartType} monitorType={monitorType} />,
  allowEscapeViewBox: { x: true, y: true },
  offset: 15,
  position: { x: undefined, y: undefined },
  wrapperStyle: {
    zIndex: 9999,
    pointerEvents: 'none' as const
  }
})

export interface MonitorCardData {
  id: string
  name: string
  status: string
  lastUpdated?: string
  description?: string
  route?: string
  iconColor?: string
  statusColor?: string
  // New fields for enhanced display
  type?: 'network' | 'transaction'
  showMetrics?: boolean
  // New field for chart type
  chartType?: ChartType
  // New field for data pattern
  dataPattern?: DataPattern
  // New field for icon type
  iconType?: string
  // New fields for visual customization
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

// Unified Props Interface Pattern
interface MonitorCardConfig {
  showPreview?: boolean
  showMetrics?: boolean
  interactive?: boolean
}

interface MonitorCardProps {
  // New unified interface
  data: MonitorCardData
  config?: MonitorCardConfig
  onSelect?: (data: MonitorCardData) => void
  onNavigate?: (route: string) => void
  className?: string

  // Legacy interface (deprecated but maintained for backward compatibility)
  /** @deprecated Use data instead */
  monitor?: MonitorCardData
  /** @deprecated Use onSelect instead */
  onClick?: (monitor: MonitorCardData) => void
  /** @deprecated Use config.showPreview instead */
  showPreview?: boolean
}

// Icon mapping function to get appropriate icon based on monitor name/type
function getMonitorIcon(monitor: MonitorCardData) {
  // If iconType is explicitly set, use it
  if (monitor.iconType) {
    switch (monitor.iconType) {
      case 'credit-card': return CreditCard
      case 'database': return Database
      case 'server': return Server
      case 'zap': return Zap
      case 'shield': return Shield
      case 'globe': return Globe
      case 'message': return MessageSquare
      case 'storage': return HardDrive
      case 'network': return Network
      case 'chart': return BarChart3
      case 'cpu': return Cpu
      case 'cloud': return Cloud
      case 'lock': return Lock
      case 'activity': return Activity
      default: return MonitorIcon
    }
  }

  // Auto-detect based on monitor name
  const name = monitor.name.toLowerCase()

  // Payment and financial services
  if (name.includes('visa') || name.includes('payment') || name.includes('card')) {
    return CreditCard
  }

  // Database services
  if (name.includes('database') || name.includes('db') || name.includes('sql')) {
    return Database
  }

  // API and gateway services
  if (name.includes('api') || name.includes('gateway') || name.includes('service')) {
    return Server
  }

  // Load balancer and traffic management
  if (name.includes('load') || name.includes('balancer') || name.includes('traffic')) {
    return Zap
  }

  // Authentication and security
  if (name.includes('auth') || name.includes('security') || name.includes('login')) {
    return Shield
  }

  // Cache services
  if (name.includes('cache') || name.includes('redis') || name.includes('memory')) {
    return Cpu
  }

  // Message queue and communication
  if (name.includes('message') || name.includes('queue') || name.includes('kafka') || name.includes('rabbit')) {
    return MessageSquare
  }

  // File storage and data
  if (name.includes('file') || name.includes('storage') || name.includes('s3') || name.includes('blob')) {
    return HardDrive
  }

  // Network and connectivity
  if (name.includes('network') || name.includes('cdn') || name.includes('proxy')) {
    return Network
  }

  // Default fallback
  return MonitorIcon
}

export default function MonitorCard({
  // New unified props
  data,
  config,
  onSelect,
  onNavigate,
  className = "",

  // Legacy props (deprecated)
  monitor,
  onClick,
  showPreview = false
}: MonitorCardProps) {
  const [isClient, setIsClient] = useState(false)

  // Support both new and legacy interfaces
  const monitorData = data || monitor
  const cardConfig = config || {}
  const shouldShowPreview = cardConfig.showPreview ?? showPreview

  // Unified event handler
  const handleCardClick = () => {
    if (!monitorData) return

    // New unified interface
    if (onSelect) {
      onSelect(monitorData)
    }

    // Legacy interface support
    if (onClick) {
      onClick(monitorData)
    }

    // Handle navigation
    if (monitorData.route) {
      if (onNavigate) {
        onNavigate(`/monitor/${monitorData.route}`)
      }
      // Note: Default navigation is handled by parent components
    }
  }

  // Early return if no monitor data
  if (!monitorData) {
    return null
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate data for metrics display
  const chartData = useMemo(() => {
    if (!isClient || !monitorData.showMetrics || !monitorData.type) return []
    if (monitorData.dataPattern) {
      return generateMiniCardDataWithPattern(monitorData.type, monitorData.dataPattern)
    }
    return generateMiniCardData(monitorData.type)
  }, [isClient, monitorData.showMetrics, monitorData.type, monitorData.dataPattern])

  const healthIndicator = useMemo(() => {
    if (!chartData.length || !monitorData.type) return null

    const value = monitorData.type === 'network'
      ? calculateNHI(chartData)
      : calculateTHI(chartData)

    return {
      value,
      label: monitorData.type === 'network' ? 'NHI' : 'THI',
      color: getHealthColor(value),
      bgColor: getHealthBgColor(value)
    }
  }, [chartData, monitorData.type])

  const getIconStyleClass = (monitor?: MonitorCardData) => {
    // Unified diagonal texture design system
    // All icons use the same elegant diagonal stripe pattern
    return 'bg-slate-50 text-slate-700 border border-slate-200 icon-texture-diagonal'
  }

  const getStatusColorClass = (statusColor?: string) => {
    switch (statusColor) {
      case 'orange':
        return 'bg-orange-500'
      case 'blue':
        return 'bg-blue-500'
      case 'green':
        return 'bg-green-500'
      default:
        return 'bg-green-500'
    }
  }

  // Check if this is a test card
  const isTestCard = monitorData.id.startsWith('test-') || monitorData.name.includes('[TEST]')

  // Function to render different chart types
  const renderChart = () => {
    const chartType = monitorData.chartType || (monitorData.type === 'network' ? 'area' : 'line')
    // Use design tokens instead of hardcoded colors
    const colors = monitorData.chartColors || getMonitorTypeColors(monitorData.type || 'network')
    const uiColors = getChartUIColors()
    const style = monitorData.chartStyle || { strokeWidth: 2, opacity: 1 }

    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`networkGradient-${monitorData.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="inMbps"
              stroke={colors.primary}
              strokeWidth={style.strokeWidth}
              fill={`url(#networkGradient-${monitorData.id})`}
              dot={false}
            />
          </AreaChart>
        )

      case 'line':
        return (
          <LineChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="req"
              stroke={colors.primary}
              strokeWidth={style.strokeWidth}
              dot={false}
            />
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
            />
            <Bar
              dataKey="req"
              fill={colors.primary}
              radius={[2, 2, 0, 0]}
              opacity={style.opacity}
            />
          </BarChart>
        )

      case 'scatter':
        return (
          <ScatterChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter
              dataKey="rtt"
              fill={colors.primary}
            />
          </ScatterChart>
        )

      case 'step':
        return (
          <LineChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="stepAfter"
              dataKey="successRate"
              stroke={colors.primary}
              strokeWidth={style.strokeWidth}
              dot={false}
            />
          </LineChart>
        )

      case 'composed':
        return (
          <ComposedChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: uiColors.grid, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Bar dataKey="req" fill={colors.primary} opacity={0.6} />
            <Line
              type="monotone"
              dataKey="rtt"
              stroke={colors.secondary}
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        )

      case 'gradient-area':
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradientArea-${monitorData.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.8}/>
                <stop offset="50%" stopColor={colors.secondary} stopOpacity={0.6}/>
                <stop offset="100%" stopColor={colors.accent} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="inMbps"
              stroke={colors.primary}
              strokeWidth={3}
              fill={`url(#gradientArea-${monitorData.id})`}
              dot={false}
            />
          </AreaChart>
        )

      case 'multi-line':
        return (
          <LineChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: uiColors.grid, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="req"
              stroke={colors.primary}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="rtt"
              stroke={colors.secondary}
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="successRate"
              stroke={colors.accent}
              strokeWidth={2}
              dot={false}
              strokeDasharray="2 2"
            />
          </LineChart>
        )

      case 'stacked-bar':
        return (
          <BarChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="req" stackId="a" fill={colors.primary} />
            <Bar dataKey="rtt" stackId="a" fill={colors.secondary} />
            <Bar dataKey="loss" stackId="a" fill={colors.accent} />
          </BarChart>
        )

      case 'bubble':
        return (
          <ScatterChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter
              dataKey="rtt"
              fill={colors.primary}
              shape="circle"
            />
            <Scatter
              dataKey="req"
              fill={colors.secondary}
              shape="circle"
            />
          </ScatterChart>
        )

      case 'heatmap':
        return (
          <BarChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
            />
            {data.map((_, index) => (
              <Bar
                key={index}
                dataKey="req"
                fill={`hsl(${(index * 30) % 360}, 70%, 60%)`}
                radius={[1, 1, 0, 0]}
              />
            ))}
          </BarChart>
        )

      case 'radial':
        return (
          <AreaChart data={chartData}>
            <defs>
              <radialGradient id={`radialGradient-${monitorData.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={colors.secondary} stopOpacity={0.2}/>
              </radialGradient>
            </defs>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="req"
              stroke={colors.primary}
              strokeWidth={2}
              fill={`url(#radialGradient-${monitorData.id})`}
              dot={false}
            />
          </AreaChart>
        )

      case 'waterfall':
        return (
          <BarChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
            />
            <Bar
              dataKey="req"
              fill={colors.secondary}
              shape={(props: any) => {
                const { x, y, width, height } = props
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={height > 20 ? colors.accent : uiColors.danger}
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                )
              }}
            />
          </BarChart>
        )

      case 'candlestick':
        return (
          <ComposedChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: uiColors.grid, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Bar dataKey="req" fill={colors.accent} opacity={0.3} />
            <Line
              type="monotone"
              dataKey="rtt"
              stroke={colors.secondary}
              strokeWidth={3}
              dot={{ fill: colors.secondary, strokeWidth: 2, r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="successRate"
              stroke={colors.primary}
              strokeWidth={1}
              dot={false}
            />
          </ComposedChart>
        )

      case 'pulse-wave':
        return (
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id={`pulseGradient-${monitorData.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.9}/>
                <stop offset="50%" stopColor={colors.secondary} stopOpacity={0.6}/>
                <stop offset="100%" stopColor={colors.accent} stopOpacity={0.1}/>
              </linearGradient>
              <filter id={`glow-${monitorData.id}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="req"
              stroke={colors.primary}
              strokeWidth={style.strokeWidth || 2}
              fill={`url(#pulseGradient-${monitorData.id})`}
              dot={false}
              filter={style.glow ? `url(#glow-${monitorData.id})` : undefined}
            />
            <Line
              type="monotone"
              dataKey="rtt"
              stroke={colors.secondary}
              strokeWidth={(style.strokeWidth || 2) + 1}
              dot={{ fill: colors.secondary, strokeWidth: 0, r: 2 }}
              strokeDasharray="3 3"
            />
          </ComposedChart>
        )

      default:
        return (
          <LineChart data={chartData}>
            <Tooltip
              {...getTooltipConfig(chartType, monitorData.type || 'network')}
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="req"
              stroke={colors.primary}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )
    }
  }

  // Render enhanced card with metrics or simple card
  if (monitorData.showMetrics && monitorData.type && chartData.length > 0 && healthIndicator) {
    return (
      <Card
        className={`hover:shadow-lg transition-all duration-200 hover:border-primary/50 monitor-card-size overflow-visible ${isTestCard ? 'border-dashed border-amber-200 bg-amber-50/20' : ''} ${className}`}
        onClick={handleCardClick}
      >
        <CardContent className="flex flex-col h-full p-3 relative">
          {/* Test Card Badge - text only in bottom margin area */}
          {isTestCard && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-amber-600 text-[10px] font-medium uppercase tracking-wide opacity-60">
              TEST
            </div>
          )}
          {/* Header with Icon and Title */}
          <div className="flex items-start gap-3 mb-2">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconStyleClass(monitorData)}`}>
              {(() => {
                const IconComponent = getMonitorIcon(monitorData)
                return <IconComponent className="h-6 w-6" />
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <FadeTitle className="font-medium text-foreground text-sm mb-1">
                {monitorData.name}
              </FadeTitle>
              {/* Health Indicator below title */}
              <div className="flex items-center">
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${healthIndicator.bgColor} ${healthIndicator.color}`}>
                  <span className="text-[10px] font-semibold tracking-wide uppercase opacity-75 mr-1">
                    {healthIndicator.label}
                  </span>
                  <span className="font-bold">
                    {healthIndicator.value.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Series Chart */}
          <div className="flex-1 mb-1 relative">
            <div className="h-24 w-full bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg p-2 overflow-visible">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/30 rounded">
                  <Activity className="h-4 w-4 text-muted-foreground animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="text-xs">
            {monitorData.type === 'network' ? (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Network Traffic
                </span>
                <span className="font-medium text-foreground bg-muted/50 px-2 py-0.5 rounded">
                  Last 15min
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Transaction Volume
                </span>
                <span className="font-medium text-foreground bg-muted/50 px-2 py-0.5 rounded">
                  Last 15min
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Fallback to simple card
  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 hover:border-primary/50 monitor-card-size ${isTestCard ? 'border-dashed border-amber-200 bg-amber-50/20' : ''} ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="flex flex-col h-full p-4 relative">
        {/* Test Card Badge - text only in bottom margin area */}
        {isTestCard && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-amber-600 text-[10px] font-medium uppercase tracking-wide opacity-60">
            TEST
          </div>
        )}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconStyleClass(monitorData)}`}>
            {(() => {
              const IconComponent = getMonitorIcon(monitorData)
              return <IconComponent className="h-6 w-6" />
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <FadeTitle className="font-medium text-foreground">
              {monitorData.name}
            </FadeTitle>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            {monitorData.description || (monitorData.lastUpdated ? `Updated ${monitorData.lastUpdated}` : '')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
