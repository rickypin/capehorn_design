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
  const getMetricInfo = (dataKey: string) => {
    const metricMap: Record<string, { label: string; unit: string; color?: string }> = {
      // Network metrics
      inMbps: { label: 'Inbound Traffic', unit: 'Mbps', color: '#3b82f6' },
      outMbps: { label: 'Outbound Traffic', unit: 'Mbps', color: '#06b6d4' },
      rtt: { label: 'Round Trip Time', unit: 'ms', color: '#ef4444' },
      loss: { label: 'Packet Loss', unit: '%', color: '#f59e0b' },
      retrans: { label: 'Retransmission', unit: '%', color: '#ef4444' },
      // Transaction metrics
      req: { label: 'Requests', unit: '/min', color: '#f59e0b' },
      successRate: { label: 'Success Rate', unit: '%', color: '#10b981' },
      respP95: { label: 'Response Time P95', unit: 'ms', color: '#6366f1' },
      errorRate: { label: 'Error Rate', unit: '%', color: '#ef4444' },
    }
    return metricMap[dataKey] || { label: dataKey, unit: '', color: '#6b7280' }
  }

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border corner-sm shadow-lg p-3 min-w-[200px] max-w-[250px] z-50 relative">
      {label && (
        <div className="text-xs text-muted-foreground mb-2 font-medium">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => {
          const metricInfo = getMetricInfo(entry.dataKey)
          const value = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value

          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 corner-xs flex-shrink-0"
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
    pointerEvents: 'none'
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

interface MonitorCardProps {
  monitor: MonitorCardData
  onClick?: (monitor: MonitorCardData) => void
  className?: string
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
  monitor,
  onClick,
  className = "",
  showPreview = false
}: MonitorCardProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate data for metrics display
  const data = useMemo(() => {
    if (!isClient || !monitor.showMetrics || !monitor.type) return []
    if (monitor.dataPattern) {
      return generateMiniCardDataWithPattern(monitor.type, monitor.dataPattern)
    }
    return generateMiniCardData(monitor.type)
  }, [isClient, monitor.showMetrics, monitor.type, monitor.dataPattern])

  const healthIndicator = useMemo(() => {
    if (!data.length || !monitor.type) return null

    const value = monitor.type === 'network'
      ? calculateNHI(data)
      : calculateTHI(data)

    return {
      value,
      label: monitor.type === 'network' ? 'NHI' : 'THI',
      color: getHealthColor(value),
      bgColor: getHealthBgColor(value)
    }
  }, [data, monitor.type])

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

  const handleClick = () => {
    if (onClick) {
      onClick(monitor)
    }
  }

  // Check if this is a test card
  const isTestCard = monitor.id.startsWith('test-') || monitor.name.includes('[TEST]')

  // Function to render different chart types
  const renderChart = () => {
    const chartType = monitor.chartType || (monitor.type === 'network' ? 'area' : 'line')
    const colors = monitor.chartColors || {
      primary: monitor.type === 'network' ? '#3b82f6' : '#f59e0b',
      secondary: '#ef4444',
      accent: '#10b981'
    }
    const style = monitor.chartStyle || { strokeWidth: 2, opacity: 1 }

    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`networkGradient-${monitor.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="inMbps"
              stroke={colors.primary}
              strokeWidth={style.strokeWidth}
              fill={`url(#networkGradient-${monitor.id})`}
              dot={false}
            />
          </AreaChart>
        )

      case 'line':
        return (
          <LineChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
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
          <BarChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
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
          <ScatterChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
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
          <LineChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
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
          <ComposedChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Bar dataKey="req" fill="#f59e0b" opacity={0.6} />
            <Line
              type="monotone"
              dataKey="rtt"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        )

      case 'gradient-area':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradientArea-${monitor.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.6}/>
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="inMbps"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill={`url(#gradientArea-${monitor.id})`}
              dot={false}
            />
          </AreaChart>
        )

      case 'multi-line':
        return (
          <LineChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="req"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="rtt"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="successRate"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              strokeDasharray="2 2"
            />
          </LineChart>
        )

      case 'stacked-bar':
        return (
          <BarChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="req" stackId="a" fill="#3b82f6" />
            <Bar dataKey="rtt" stackId="a" fill="#f59e0b" />
            <Bar dataKey="loss" stackId="a" fill="#ef4444" />
          </BarChart>
        )

      case 'bubble':
        return (
          <ScatterChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Scatter
              dataKey="rtt"
              fill="#8b5cf6"
              shape="circle"
            />
            <Scatter
              dataKey="req"
              fill="#06b6d4"
              shape="circle"
            />
          </ScatterChart>
        )

      case 'heatmap':
        return (
          <BarChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
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
          <AreaChart data={data}>
            <defs>
              <radialGradient id={`radialGradient-${monitor.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.2}/>
              </radialGradient>
            </defs>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="req"
              stroke="#f59e0b"
              strokeWidth={2}
              fill={`url(#radialGradient-${monitor.id})`}
              dot={false}
            />
          </AreaChart>
        )

      case 'waterfall':
        return (
          <BarChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
            />
            <Bar
              dataKey="req"
              fill="#06b6d4"
              shape={(props: any) => {
                const { x, y, width, height } = props
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={height > 20 ? "#10b981" : "#ef4444"}
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
          <ComposedChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Bar dataKey="req" fill="#10b981" opacity={0.3} />
            <Line
              type="monotone"
              dataKey="rtt"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="successRate"
              stroke="#06b6d4"
              strokeWidth={1}
              dot={false}
            />
          </ComposedChart>
        )

      case 'pulse-wave':
        return (
          <ComposedChart data={data}>
            <defs>
              <linearGradient id={`pulseGradient-${monitor.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary || "#8b5cf6"} stopOpacity={0.9}/>
                <stop offset="50%" stopColor={colors.secondary || "#06b6d4"} stopOpacity={0.6}/>
                <stop offset="100%" stopColor={colors.accent || "#10b981"} stopOpacity={0.1}/>
              </linearGradient>
              <filter id={`glow-${monitor.id}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ stroke: colors.primary || '#8b5cf6', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area
              type="monotone"
              dataKey="req"
              stroke={colors.primary || "#8b5cf6"}
              strokeWidth={style.strokeWidth || 2}
              fill={`url(#pulseGradient-${monitor.id})`}
              dot={false}
              filter={style.glow ? `url(#glow-${monitor.id})` : undefined}
            />
            <Line
              type="monotone"
              dataKey="rtt"
              stroke={colors.secondary || "#06b6d4"}
              strokeWidth={(style.strokeWidth || 2) + 1}
              dot={{ fill: colors.secondary || "#06b6d4", strokeWidth: 0, r: 2 }}
              strokeDasharray="3 3"
            />
          </ComposedChart>
        )

      default:
        return (
          <LineChart data={data}>
            <Tooltip
              {...getTooltipConfig(chartType, monitor.type)}
              cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="req"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )
    }
  }

  // Render enhanced card with metrics or simple card
  if (monitor.showMetrics && monitor.type && data.length > 0 && healthIndicator) {
    return (
      <Card
        className={`hover:shadow-lg transition-all duration-200 hover:border-primary/50 monitor-card-size overflow-visible ${isTestCard ? 'border-dashed border-amber-200 bg-amber-50/20' : ''} ${className}`}
        onClick={handleClick}
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
            <div className={`w-12 h-12 corner-sm flex items-center justify-center ${getIconStyleClass(monitor)}`}>
              {(() => {
                const IconComponent = getMonitorIcon(monitor)
                return <IconComponent className="h-6 w-6" />
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <FadeTitle className="font-medium text-foreground text-sm mb-1">
                {monitor.name}
              </FadeTitle>
              {/* Health Indicator below title */}
              <div className="flex items-center">
                <div className={`inline-flex items-center px-2 py-1 corner-xs text-xs font-medium ${healthIndicator.bgColor} ${healthIndicator.color}`}>
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
            <div className="h-24 w-full bg-gradient-to-br from-muted/20 to-muted/5 corner-sm p-2 overflow-visible">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/30 corner-xs">
                  <Activity className="h-4 w-4 text-muted-foreground animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="text-xs">
            {monitor.type === 'network' ? (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Network Traffic
                </span>
                <span className="font-medium text-foreground bg-muted/50 px-2 py-0.5 corner-xs">
                  Last 15min
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Transaction Volume
                </span>
                <span className="font-medium text-foreground bg-muted/50 px-2 py-0.5 corner-xs">
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
      onClick={handleClick}
    >
      <CardContent className="flex flex-col h-full p-4 relative">
        {/* Test Card Badge - text only in bottom margin area */}
        {isTestCard && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-amber-600 text-[10px] font-medium uppercase tracking-wide opacity-60">
            TEST
          </div>
        )}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 corner-sm flex items-center justify-center ${getIconStyleClass(monitor)}`}>
            {(() => {
              const IconComponent = getMonitorIcon(monitor)
              return <IconComponent className="h-6 w-6" />
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <FadeTitle className="font-medium text-foreground">
              {monitor.name}
            </FadeTitle>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            {monitor.description || (monitor.lastUpdated ? `Updated ${monitor.lastUpdated}` : '')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
