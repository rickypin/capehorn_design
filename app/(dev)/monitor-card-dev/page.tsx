"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import MonitorCard, { MonitorCardData } from "@/components/shared/MonitorCard"
import { 
  Settings, 
  Copy, 
  RefreshCw,
  Code,
  Eye,
  Palette,
  Sliders
} from "lucide-react"

// Default configuration for MonitorCard
const defaultMonitorConfig: MonitorCardData = {
  id: "dev-monitor-1",
  name: "Sample Monitor",
  status: "active",
  type: "network",
  showMetrics: true,
  iconColor: "blue",
  statusColor: "green",
  description: "This is a sample monitor for development",
  chartType: "area",
  dataPattern: "normal",
  iconType: "network",
  lastUpdated: "2 minutes ago"
}

// Available options for dropdowns
const statusOptions = ["active", "warning", "error", "inactive"]
const typeOptions = ["network", "transaction"]
const chartTypeOptions = ["area", "line", "bar", "scatter", "composed", "pulse-wave"]
const dataPatternOptions = ["normal", "spike", "decline", "volatile", "steady"]
const iconTypeOptions = [
  "network", "credit-card", "database", "server", "zap", "shield", 
  "globe", "message-square", "hard-drive", "bar-chart", "cpu", "cloud", "lock"
]
const colorOptions = ["blue", "green", "orange", "red", "purple", "yellow", "gray"]

export default function MonitorCardDevPage() {
  const [config, setConfig] = useState<MonitorCardData>(defaultMonitorConfig)
  const [showCode, setShowCode] = useState(false)

  // Update configuration
  const updateConfig = (key: keyof MonitorCardData, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  // Reset to defaults
  const resetConfig = () => {
    setConfig({ ...defaultMonitorConfig })
  }

  // Generate random ID
  const generateRandomId = () => {
    const randomId = `dev-monitor-${Math.floor(Math.random() * 1000)}`
    updateConfig('id', randomId)
  }

  // Copy configuration to clipboard
  const copyConfig = async () => {
    const configText = JSON.stringify(config, null, 2)
    await navigator.clipboard.writeText(configText)
  }

  // Generate code example
  const generateCodeExample = () => {
    return `import MonitorCard, { MonitorCardData } from "@/components/shared/MonitorCard"

const monitorConfig: MonitorCardData = ${JSON.stringify(config, null, 2)}

function MyComponent() {
  return (
    <MonitorCard
      monitor={monitorConfig}
      onClick={(monitor) => console.log('Clicked:', monitor.name)}
    />
  )
}`
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          MonitorCard Development Tool
        </h1>
        <p className="text-muted-foreground">
          Interactive development environment for the MonitorCard component with real-time preview and configuration options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="h-5 w-5" />
              Configuration Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Properties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Properties</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="id"
                      value={config.id}
                      onChange={(e) => updateConfig('id', e.target.value)}
                    />
                    <Button size="sm" variant="outline" onClick={generateRandomId}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => updateConfig('name', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={config.description || ''}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastUpdated">Last Updated</Label>
                <Input
                  id="lastUpdated"
                  value={config.lastUpdated || ''}
                  onChange={(e) => updateConfig('lastUpdated', e.target.value)}
                  placeholder="e.g., 2 minutes ago"
                />
              </div>
            </div>

            {/* Status and Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status & Type</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={config.status} onValueChange={(value) => updateConfig('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={config.type} onValueChange={(value) => updateConfig('type', value as 'network' | 'transaction')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Visual Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Visual Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon Type</Label>
                  <Select value={config.iconType} onValueChange={(value) => updateConfig('iconType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconTypeOptions.map(icon => (
                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Icon Color</Label>
                  <Select value={config.iconColor} onValueChange={(value) => updateConfig('iconColor', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status Color</Label>
                <Select value={config.statusColor} onValueChange={(value) => updateConfig('statusColor', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Metrics Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Metrics Configuration</h3>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showMetrics"
                  checked={config.showMetrics}
                  onCheckedChange={(checked) => updateConfig('showMetrics', checked)}
                />
                <Label htmlFor="showMetrics">Show Metrics</Label>
              </div>

              {config.showMetrics && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chart Type</Label>
                    <Select value={config.chartType} onValueChange={(value) => updateConfig('chartType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {chartTypeOptions.map(chart => (
                          <SelectItem key={chart} value={chart}>{chart}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data Pattern</Label>
                    <Select value={config.dataPattern} onValueChange={(value) => updateConfig('dataPattern', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dataPatternOptions.map(pattern => (
                          <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button onClick={resetConfig} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={copyConfig} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Config
              </Button>
              <Button onClick={() => setShowCode(!showCode)} variant="outline">
                <Code className="h-4 w-4 mr-2" />
                {showCode ? 'Hide' : 'Show'} Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center p-4">
                <div className="w-80">
                  <MonitorCard
                    monitor={config}
                    onClick={(monitor) => console.log('Preview clicked:', monitor.name)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Example */}
          {showCode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Code Example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generateCodeExample()}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Documentation Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Component Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Props Documentation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">MonitorCardData Interface</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">Property</th>
                      <th className="border border-border p-2 text-left">Type</th>
                      <th className="border border-border p-2 text-left">Required</th>
                      <th className="border border-border p-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">id</td>
                      <td className="border border-border p-2 text-sm">string</td>
                      <td className="border border-border p-2 text-sm">✓</td>
                      <td className="border border-border p-2 text-sm">Unique identifier for the monitor</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">name</td>
                      <td className="border border-border p-2 text-sm">string</td>
                      <td className="border border-border p-2 text-sm">✓</td>
                      <td className="border border-border p-2 text-sm">Display name of the monitor</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">status</td>
                      <td className="border border-border p-2 text-sm">string</td>
                      <td className="border border-border p-2 text-sm">✓</td>
                      <td className="border border-border p-2 text-sm">Current status: active, warning, error, inactive</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">type</td>
                      <td className="border border-border p-2 text-sm">'network' | 'transaction'</td>
                      <td className="border border-border p-2 text-sm">-</td>
                      <td className="border border-border p-2 text-sm">Monitor type for data generation</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">showMetrics</td>
                      <td className="border border-border p-2 text-sm">boolean</td>
                      <td className="border border-border p-2 text-sm">-</td>
                      <td className="border border-border p-2 text-sm">Whether to display metrics and charts</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">chartType</td>
                      <td className="border border-border p-2 text-sm">ChartType</td>
                      <td className="border border-border p-2 text-sm">-</td>
                      <td className="border border-border p-2 text-sm">Type of chart: area, line, bar, scatter, composed, pulse-wave</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">dataPattern</td>
                      <td className="border border-border p-2 text-sm">DataPattern</td>
                      <td className="border border-border p-2 text-sm">-</td>
                      <td className="border border-border p-2 text-sm">Data pattern: normal, spike, decline, volatile, steady</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">iconType</td>
                      <td className="border border-border p-2 text-sm">string</td>
                      <td className="border border-border p-2 text-sm">-</td>
                      <td className="border border-border p-2 text-sm">Icon type from available icon set</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">iconColor</td>
                      <td className="border border-border p-2 text-sm">string</td>
                      <td className="border border-border p-2 text-sm">-</td>
                      <td className="border border-border p-2 text-sm">Color theme for the icon</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">statusColor</td>
                      <td className="border border-border p-2 text-sm">string</td>
                      <td className="border border-border p-2 text-sm">-</td>
                      <td className="border border-border p-2 text-sm">Color theme for status indicators</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">description</td>
                      <td className="border border-border p-2 text-sm">string</td>
                      <td className="border border-border p-2 text-sm">-</td>
                      <td className="border border-border p-2 text-sm">Optional description text</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-mono text-sm">lastUpdated</td>
                      <td className="border border-border p-2 text-sm">string</td>
                      <td className="border border-border p-2 text-sm">-</td>
                      <td className="border border-border p-2 text-sm">Last update timestamp or relative time</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Usage Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Usage Examples</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Basic Monitor Card</h4>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    <code>{`const basicMonitor: MonitorCardData = {
  id: "basic-1",
  name: "Simple Monitor",
  status: "active"
}

<MonitorCard monitor={basicMonitor} />`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Enhanced Monitor with Metrics</h4>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    <code>{`const enhancedMonitor: MonitorCardData = {
  id: "enhanced-1",
  name: "Network Monitor",
  status: "active",
  type: "network",
  showMetrics: true,
  chartType: "area",
  dataPattern: "normal",
  iconType: "network",
  iconColor: "blue",
  statusColor: "green",
  description: "Network traffic monitoring"
}

<MonitorCard
  monitor={enhancedMonitor}
  onClick={(monitor) => console.log('Clicked:', monitor.name)}
/>`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Transaction Monitor with Custom Chart</h4>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    <code>{`const transactionMonitor: MonitorCardData = {
  id: "transaction-1",
  name: "Payment Processing",
  status: "warning",
  type: "transaction",
  showMetrics: true,
  chartType: "line",
  dataPattern: "spike",
  iconType: "credit-card",
  iconColor: "orange",
  statusColor: "orange",
  description: "Real-time payment processing metrics",
  lastUpdated: "30 seconds ago"
}

<MonitorCard monitor={transactionMonitor} />`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Available Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Options</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Chart Types</h4>
                  <div className="flex flex-wrap gap-1">
                    {chartTypeOptions.map(type => (
                      <Badge key={type} variant="secondary">{type}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Data Patterns</h4>
                  <div className="flex flex-wrap gap-1">
                    {dataPatternOptions.map(pattern => (
                      <Badge key={pattern} variant="secondary">{pattern}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Icon Types</h4>
                  <div className="flex flex-wrap gap-1">
                    {iconTypeOptions.map(icon => (
                      <Badge key={icon} variant="secondary">{icon}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Color Options</h4>
                  <div className="flex flex-wrap gap-1">
                    {colorOptions.map(color => (
                      <Badge key={color} variant="secondary">{color}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Design Guidelines */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Design Guidelines</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Use <strong>network</strong> type for infrastructure monitoring (servers, APIs, networks)</p>
                <p>• Use <strong>transaction</strong> type for business process monitoring (payments, orders, workflows)</p>
                <p>• Choose chart types based on data characteristics: <strong>area</strong> for trends, <strong>line</strong> for precise values, <strong>bar</strong> for comparisons</p>
                <p>• Use appropriate data patterns: <strong>normal</strong> for steady metrics, <strong>spike</strong> for alerts, <strong>volatile</strong> for unstable systems</p>
                <p>• Keep names concise but descriptive (max 20-25 characters for optimal display)</p>
                <p>• Use status colors consistently: <strong>green</strong> for healthy, <strong>orange</strong> for warnings, <strong>red</strong> for errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
