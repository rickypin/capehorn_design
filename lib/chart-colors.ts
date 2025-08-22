/**
 * Chart Color System
 * 
 * This module provides utilities for accessing chart colors using CSS custom properties
 * instead of hardcoded hex values. This follows Tailwind CSS best practices for design tokens.
 * 
 * All colors are defined in app/globals.css using CSS custom properties and are automatically
 * theme-aware (light/dark mode).
 */

/**
 * Chart color configuration interface
 */
export interface ChartColors {
  primary: string
  secondary: string
  accent: string
}

/**
 * Metric-specific color configuration
 */
export interface MetricColors {
  label: string
  unit: string
  color: string
}

/**
 * Get CSS custom property value
 * This function reads the actual computed CSS custom property value
 */
function getCSSCustomProperty(property: string): string {
  if (typeof window === 'undefined') {
    // Server-side fallback - return the CSS variable reference
    return `var(${property})`
  }
  
  const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim()
  return value || `var(${property})`
}

/**
 * Get semantic chart colors using design tokens
 * These colors automatically adapt to light/dark mode
 */
export function getChartColors(): ChartColors {
  return {
    primary: getCSSCustomProperty('--chart-primary'),
    secondary: getCSSCustomProperty('--chart-secondary'),
    accent: getCSSCustomProperty('--chart-accent')
  }
}

/**
 * Get chart colors for specific monitor types
 * Returns appropriate color scheme based on monitor type
 */
export function getMonitorTypeColors(type: 'network' | 'transaction'): ChartColors {
  if (type === 'network') {
    return {
      primary: getCSSCustomProperty('--chart-network-inbound'),
      secondary: getCSSCustomProperty('--chart-network-outbound'),
      accent: getCSSCustomProperty('--chart-network-latency')
    }
  } else {
    return {
      primary: getCSSCustomProperty('--chart-transaction-requests'),
      secondary: getCSSCustomProperty('--chart-transaction-success'),
      accent: getCSSCustomProperty('--chart-transaction-response')
    }
  }
}

/**
 * Get metric-specific colors and labels
 * Returns color and metadata for specific data metrics
 */
export function getMetricInfo(dataKey: string): MetricColors {
  const metricMap: Record<string, MetricColors> = {
    // Network metrics
    inMbps: { 
      label: 'Inbound Traffic', 
      unit: 'Mbps', 
      color: getCSSCustomProperty('--chart-network-inbound')
    },
    outMbps: { 
      label: 'Outbound Traffic', 
      unit: 'Mbps', 
      color: getCSSCustomProperty('--chart-network-outbound')
    },
    rtt: { 
      label: 'Round Trip Time', 
      unit: 'ms', 
      color: getCSSCustomProperty('--chart-network-latency')
    },
    loss: { 
      label: 'Packet Loss', 
      unit: '%', 
      color: getCSSCustomProperty('--chart-network-loss')
    },
    retrans: { 
      label: 'Retransmission', 
      unit: '%', 
      color: getCSSCustomProperty('--chart-danger')
    },
    // Transaction metrics
    req: { 
      label: 'Requests', 
      unit: '/min', 
      color: getCSSCustomProperty('--chart-transaction-requests')
    },
    successRate: { 
      label: 'Success Rate', 
      unit: '%', 
      color: getCSSCustomProperty('--chart-transaction-success')
    },
    respP95: { 
      label: 'Response Time P95', 
      unit: 'ms', 
      color: getCSSCustomProperty('--chart-transaction-response')
    },
    errorRate: { 
      label: 'Error Rate', 
      unit: '%', 
      color: getCSSCustomProperty('--chart-transaction-error')
    },
  }
  
  return metricMap[dataKey] || { 
    label: dataKey, 
    unit: '', 
    color: getCSSCustomProperty('--chart-grid')
  }
}

/**
 * Get UI element colors for charts
 * Returns colors for chart UI elements like grids, tooltips, etc.
 */
export function getChartUIColors() {
  return {
    grid: getCSSCustomProperty('--chart-grid'),
    tooltipBg: getCSSCustomProperty('--chart-tooltip-bg'),
    tooltipBorder: getCSSCustomProperty('--chart-tooltip-border'),
    warning: getCSSCustomProperty('--chart-warning'),
    danger: getCSSCustomProperty('--chart-danger'),
    info: getCSSCustomProperty('--chart-info'),
    success: getCSSCustomProperty('--chart-success')
  }
}

/**
 * Get gradient colors for advanced chart types
 * Returns color arrays for gradient effects
 */
export function getGradientColors(type: 'primary' | 'secondary' | 'accent' = 'primary') {
  const colors = getChartColors()
  const uiColors = getChartUIColors()
  
  switch (type) {
    case 'primary':
      return [colors.primary, colors.secondary, colors.accent]
    case 'secondary':
      return [colors.secondary, colors.accent, colors.primary]
    case 'accent':
      return [colors.accent, colors.primary, colors.secondary]
    default:
      return [colors.primary, colors.secondary, colors.accent]
  }
}

/**
 * Legacy compatibility function
 * Provides backward compatibility for existing chart configurations
 * @deprecated Use getChartColors() or getMonitorTypeColors() instead
 */
export function getLegacyChartColors(monitorType?: 'network' | 'transaction'): ChartColors {
  if (monitorType) {
    return getMonitorTypeColors(monitorType)
  }
  return getChartColors()
}
