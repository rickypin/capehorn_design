# MonitorCard Development Tool

## Overview

The MonitorCard Development Tool is an interactive development environment specifically designed for the `MonitorCard` component. It provides real-time configuration, live preview, and comprehensive documentation to streamline the development and testing process.

## Features

### 🎛️ Interactive Configuration Panel
- **Basic Properties**: Configure ID, name, description, and last updated timestamp
- **Status & Type**: Set monitor status and type (network/transaction)
- **Visual Configuration**: Customize icons, colors, and visual themes
- **Metrics Configuration**: Enable/disable metrics display and configure chart types

### 👁️ Live Preview
- Real-time preview of the MonitorCard component
- Instant updates as configuration changes
- Interactive component with click handling

### 📝 Code Generation
- Automatic TypeScript code generation
- Copy-to-clipboard functionality for quick integration
- Complete usage examples with proper typing

### 📚 Comprehensive Documentation
- Complete props interface documentation
- Usage examples for different scenarios
- Available options reference
- Design guidelines and best practices

## Access

Navigate to the development tool via:
- **URL**: `http://localhost:3001/monitor-card-dev`
- **Sidebar**: Click the wrench (🔧) icon in the development sidebar

## Configuration Options

### Basic Properties
- **ID**: Unique identifier for the monitor
- **Name**: Display name (recommended max 20-25 characters)
- **Description**: Optional descriptive text
- **Last Updated**: Timestamp or relative time string

### Status & Type
- **Status**: `active`, `warning`, `error`, `inactive`
- **Type**: `network` (infrastructure) or `transaction` (business processes)

### Visual Configuration
- **Icon Type**: 13 available icons including network, credit-card, database, server, etc.
- **Icon Color**: 7 color themes (blue, green, orange, red, purple, yellow, gray)
- **Status Color**: Color theme for status indicators

### Metrics Configuration
- **Show Metrics**: Toggle metrics display on/off
- **Chart Type**: 6 chart types (area, line, bar, scatter, composed, pulse-wave)
- **Data Pattern**: 5 data patterns (normal, spike, decline, volatile, steady)

## Usage Examples

### Basic Monitor
```typescript
const basicMonitor: MonitorCardData = {
  id: "basic-1",
  name: "Simple Monitor",
  status: "active"
}

<MonitorCard monitor={basicMonitor} />
```

### Enhanced Monitor with Metrics
```typescript
const enhancedMonitor: MonitorCardData = {
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
/>
```

### Transaction Monitor
```typescript
const transactionMonitor: MonitorCardData = {
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
```

## Design Guidelines

### Monitor Types
- **Network Type**: Use for infrastructure monitoring (servers, APIs, networks, databases)
- **Transaction Type**: Use for business process monitoring (payments, orders, workflows, user actions)

### Chart Selection
- **Area Charts**: Best for showing trends and cumulative data over time
- **Line Charts**: Ideal for precise value tracking and detailed analysis
- **Bar Charts**: Perfect for comparing discrete values or categories
- **Scatter Charts**: Useful for correlation analysis and outlier detection
- **Composed Charts**: Combine multiple data series with different visualizations
- **Pulse Wave**: Specialized for heartbeat-like monitoring patterns

### Data Patterns
- **Normal**: Steady, predictable metrics with minor variations
- **Spike**: Sudden increases in activity (alerts, traffic bursts)
- **Decline**: Gradual or sudden decreases in metrics
- **Volatile**: Highly variable, unpredictable patterns
- **Steady**: Consistent, stable metrics with minimal variation

### Color Usage
- **Green**: Healthy, active, successful states
- **Orange**: Warning, attention needed, degraded performance
- **Red**: Error, critical, failed states
- **Blue**: Information, network-related, neutral active
- **Purple**: Special processes, premium features
- **Yellow**: Caution, pending, temporary states
- **Gray**: Inactive, disabled, unknown states

### Naming Conventions
- Keep names concise but descriptive (max 20-25 characters)
- Use title case for display names
- Include service/system context when helpful
- Avoid technical jargon in user-facing names

## Technical Implementation

### Dependencies
- React 18+ with hooks
- Recharts for data visualization
- Lucide React for icons
- Tailwind CSS for styling
- Custom design system components

### Performance Considerations
- Data generation is memoized to prevent unnecessary recalculations
- Client-side rendering detection prevents hydration issues
- Responsive design adapts to different screen sizes
- Optimized chart rendering with proper cleanup

### Integration Points
- Uses the same `MonitorCardData` interface as production
- Leverages existing design system tokens
- Compatible with current chart color system
- Follows established component patterns

## Development Workflow

1. **Configure**: Use the interactive panel to set up your monitor configuration
2. **Preview**: See real-time updates in the live preview panel
3. **Code**: Generate and copy the TypeScript code for your configuration
4. **Test**: Verify the component works as expected in your application
5. **Document**: Reference the built-in documentation for best practices

## Future Enhancements

- [ ] Export/import configuration presets
- [ ] Bulk configuration testing
- [ ] Performance metrics visualization
- [ ] Custom chart color configuration
- [ ] Advanced styling options
- [ ] Component variant testing
- [ ] Accessibility testing tools
- [ ] Integration with design system documentation

## Related Documentation

- [MonitorCard Component](../frontend-guidelines/components/monitor-card-system.md)
- [Chart Color System](../frontend-guidelines/design-system/chart-colors.md)
- [Card Demo Page](./card-demo-page.md)
- [Component Testing Guidelines](../frontend-guidelines/testing/component-testing.md)
