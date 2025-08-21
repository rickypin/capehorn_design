"use client"

import React from 'react'
import MonitorCard, { MonitorCardData } from '@/components/shared/MonitorCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TooltipDemoPage() {
  // Demo monitors showcasing different chart types with tooltips
  const demoMonitors: MonitorCardData[] = [
    {
      id: "demo-1",
      name: "Network Traffic Monitor",
      status: "active",
      type: "network",
      showMetrics: true,
      chartType: "area",
      iconColor: "blue",
      statusColor: "green",
      dataPattern: "normal",
      chartColors: {
        primary: "#3b82f6",
        secondary: "#06b6d4",
        accent: "#10b981"
      }
    },
    {
      id: "demo-2",
      name: "Transaction Volume",
      status: "active",
      type: "transaction",
      showMetrics: true,
      chartType: "line",
      iconColor: "orange",
      statusColor: "green",
      dataPattern: "spike",
      chartColors: {
        primary: "#f59e0b",
        secondary: "#ef4444",
        accent: "#10b981"
      }
    },
    {
      id: "demo-3",
      name: "Resource Usage",
      status: "warning",
      type: "network",
      showMetrics: true,
      chartType: "stacked-bar",
      iconColor: "blue",
      statusColor: "orange",
      dataPattern: "step",
      chartColors: {
        primary: "#3b82f6",
        secondary: "#f59e0b",
        accent: "#ef4444"
      }
    },
    {
      id: "demo-4",
      name: "Performance Metrics",
      status: "active",
      type: "transaction",
      showMetrics: true,
      chartType: "multi-line",
      iconColor: "orange",
      statusColor: "green",
      dataPattern: "oscillating",
      chartColors: {
        primary: "#f59e0b",
        secondary: "#ef4444",
        accent: "#10b981"
      }
    },
    {
      id: "demo-5",
      name: "Correlation Analysis",
      status: "active",
      type: "network",
      showMetrics: true,
      chartType: "bubble",
      iconColor: "blue",
      statusColor: "green",
      dataPattern: "random-walk",
      chartColors: {
        primary: "#8b5cf6",
        secondary: "#06b6d4",
        accent: "#f59e0b"
      }
    },
    {
      id: "demo-6",
      name: "Gradient Flow",
      status: "active",
      type: "network",
      showMetrics: true,
      chartType: "gradient-area",
      iconColor: "blue",
      statusColor: "green",
      dataPattern: "sawtooth",
      chartColors: {
        primary: "#8b5cf6",
        secondary: "#06b6d4",
        accent: "#10b981"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Monitor Card Tooltip Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Hover over the charts below to see interactive tooltips with metric legends and values
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              How to Test Tooltips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 dark:text-blue-200">
            <ul className="space-y-2">
              <li>• <strong>Hover</strong> over any chart area to see the tooltip</li>
              <li>• <strong>Move your mouse</strong> along the chart to see different data points</li>
              <li>• <strong>Observe</strong> the color-coded legend and formatted values</li>
              <li>• <strong>Notice</strong> different cursor styles for different chart types</li>
              <li>• <strong>Try</strong> different chart types to see various tooltip behaviors</li>
            </ul>
          </CardContent>
        </Card>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoMonitors.map((monitor) => (
            <div key={monitor.id} className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Chart Type: {monitor.chartType}
              </div>
              <MonitorCard
                monitor={monitor}
                onClick={(m) => console.log('Clicked:', m.name)}
              />
            </div>
          ))}
        </div>

        {/* Feature List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tooltip Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Visual Elements</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Color-coded metric indicators</li>
                  <li>• Semi-transparent background with blur</li>
                  <li>• Consistent typography and spacing</li>
                  <li>• Responsive cursor styling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Display</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Human-readable metric names</li>
                  <li>• Appropriate units (Mbps, ms, %, /min)</li>
                  <li>• Formatted numeric values</li>
                  <li>• Time labels when available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
