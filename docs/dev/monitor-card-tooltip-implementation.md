# Monitor Card Tooltip Implementation

## Overview

This document describes the implementation of interactive tooltips for time series charts in Monitor Cards. The tooltips display metric legends and values when users hover over chart elements.

## Features Implemented

### 1. Custom Tooltip Component

Created a reusable `CustomTooltip` component that provides:
- **Metric Labels**: Human-readable names for data keys
- **Units**: Appropriate units for each metric type (Mbps, ms, %, /min)
- **Color Indicators**: Visual legend with color-coded metric indicators
- **Formatted Values**: Properly formatted numeric values with appropriate precision
- **Responsive Design**: Adapts to different chart types and monitor types

### 2. Chart Type Coverage

Added tooltip support for all chart types:
- **area**: Network traffic with gradient fills
- **line**: Simple line charts for transactions
- **bar**: Bar charts with hover highlighting
- **scatter**: Scatter plots for correlation analysis
- **step**: Step-after line charts for success rates
- **composed**: Combined bar and line charts
- **gradient-area**: Multi-color gradient area charts
- **multi-line**: Multiple metrics on single chart
- **stacked-bar**: Stacked bar charts for resource usage
- **bubble**: Bubble charts for multi-dimensional data
- **heatmap**: Color-coded bar charts
- **radial**: Radial gradient area charts
- **waterfall**: Waterfall charts for sequential data
- **candlestick**: Financial-style charts
- **pulse-wave**: Enhanced composed charts with effects
- **default**: Fallback line chart

### 3. Metric Mapping

Comprehensive metric mapping for both monitor types:

#### Network Metrics
- `inMbps`: Inbound Traffic (Mbps)
- `outMbps`: Outbound Traffic (Mbps)
- `rtt`: Round Trip Time (ms)
- `loss`: Packet Loss (%)
- `retrans`: Retransmission (%)

#### Transaction Metrics
- `req`: Requests (/min)
- `successRate`: Success Rate (%)
- `respP95`: Response Time P95 (ms)
- `errorRate`: Error Rate (%)

### 4. Visual Enhancements

#### Cursor Styling
- **Line Charts**: Dashed vertical line cursor
- **Bar Charts**: Semi-transparent overlay cursor
- **Scatter Charts**: Crosshair cursor with dashed lines
- **Composed Charts**: Neutral gray cursor for multi-metric clarity

#### Tooltip Styling
- **Background**: Semi-transparent with backdrop blur
- **Border**: Subtle border matching theme
- **Typography**: Clear hierarchy with metric names and values
- **Color Indicators**: 12px square color swatches
- **Spacing**: Consistent spacing for readability

## Implementation Details

### Code Structure

```typescript
// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  chartType?: ChartType
  monitorType?: 'network' | 'transaction'
}

function CustomTooltip({ active, payload, label, chartType, monitorType }: CustomTooltipProps) {
  // Metric mapping and rendering logic
}
```

### Integration Pattern

Each chart type includes the tooltip component:

```typescript
<Tooltip 
  content={<CustomTooltip chartType={chartType} monitorType={monitor.type} />}
  cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: '3 3' }}
/>
```

### Styling Classes

Uses Tailwind CSS classes for consistent theming:
- `bg-background/95 backdrop-blur-sm`: Semi-transparent background
- `border border-border corner-sm shadow-lg`: Border and shadow styling
- `text-xs font-medium text-foreground`: Typography styling
- `w-3 h-3 corner-xs`: Color indicator sizing

## Testing

The implementation can be tested using the existing monitor cards on the `/monitor` page, which includes:
- Various chart types with different data patterns
- Both network and transaction monitor types
- Different color schemes and styling options

## Benefits

1. **Enhanced User Experience**: Users can see exact values and metric names on hover
2. **Accessibility**: Clear visual indicators and readable text
3. **Consistency**: Uniform tooltip behavior across all chart types
4. **Maintainability**: Centralized tooltip logic with reusable component
5. **Extensibility**: Easy to add new metrics or customize appearance

## Future Enhancements

Potential improvements for future iterations:
- **Time Formatting**: Enhanced time display in tooltip labels
- **Threshold Indicators**: Visual indicators for metric thresholds
- **Comparison Mode**: Side-by-side metric comparisons
- **Export Functionality**: Export tooltip data or chart snapshots
- **Keyboard Navigation**: Keyboard-accessible tooltip interaction
