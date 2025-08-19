"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MonitorIcon, Activity, TrendingUp } from "lucide-react"
import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from "recharts"
import { useMemo, useEffect, useState } from "react"
import {
  generateMiniCardData,
  calculateNHI,
  calculateTHI,
  getHealthColor,
  getHealthBgColor,
  type MonitorDataPoint
} from "@/lib/monitor-data"

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
}

interface MonitorCardProps {
  monitor: MonitorCardData
  onClick?: (monitor: MonitorCardData) => void
  className?: string
  showPreview?: boolean
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
    return generateMiniCardData(monitor.type)
  }, [isClient, monitor.showMetrics, monitor.type])

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

  const getIconColorClass = (iconColor?: string) => {
    switch (iconColor) {
      case 'orange':
        return 'bg-orange-500/10 text-orange-500'
      case 'blue':
        return 'bg-primary/10 text-primary'
      default:
        return 'bg-primary/10 text-primary'
    }
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

  // Render enhanced card with metrics or simple card
  if (monitor.showMetrics && monitor.type && data.length > 0 && healthIndicator) {
    return (
      <Card
        className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 ${className}`}
        onClick={handleClick}
      >
        <CardContent className="flex flex-col h-64 p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColorClass(monitor.iconColor)}`}>
              <MonitorIcon className="h-5 w-5" />
            </div>
            <div className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${healthIndicator.bgColor} ${healthIndicator.color} shadow-sm`}>
              {healthIndicator.label}: {healthIndicator.value}
            </div>
          </div>

          {/* Title and Status */}
          <div className="mb-3">
            <h3 className="font-medium text-foreground text-sm mb-1">{monitor.name}</h3>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${getStatusColorClass(monitor.statusColor)}`}></div>
              <span className="text-xs text-muted-foreground capitalize">
                {showPreview ? 'Preview' : monitor.status}
              </span>
            </div>
          </div>

          {/* Time Series Chart */}
          <div className="flex-1 mb-2">
            <div className="h-24 w-full bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg p-2">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  {monitor.type === 'network' ? (
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id={`networkGradient-${monitor.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="inMbps"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill={`url(#networkGradient-${monitor.id})`}
                        dot={false}
                      />
                    </AreaChart>
                  ) : (
                    <LineChart data={data}>
                      <Line
                        type="monotone"
                        dataKey="req"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  )}
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
            {monitor.type === 'network' ? (
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
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 ${className}`}
      onClick={handleClick}
    >
      <CardContent className="flex flex-col h-48 p-6">
        <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${getIconColorClass(monitor.iconColor)}`}>
          <MonitorIcon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-2">{monitor.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColorClass(monitor.statusColor)}`}></div>
            <span className="text-sm text-muted-foreground capitalize">
              {showPreview ? 'Preview' : monitor.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {monitor.description || (monitor.lastUpdated ? `Updated ${monitor.lastUpdated}` : '')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
