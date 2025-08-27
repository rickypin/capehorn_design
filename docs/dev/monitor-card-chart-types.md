# Monitor Card Chart Types Documentation

## Overview

This document describes the different chart types available in the MonitorCard component and their appropriate use cases for displaying time series data in monitoring dashboards.

## Chart Types

### 1. Area Chart (`area`)
**Best for:** Network traffic, bandwidth utilization, cumulative metrics

**Characteristics:**
- Filled area under the curve
- Good for showing volume/magnitude
- Emphasizes the "amount" of data
- Works well with gradient fills

**Use Cases:**
- Network bandwidth (inMbps/outMbps)
- Memory usage over time
- Disk I/O volume
- Request volume trends

**Visual Example:** Blue gradient fill showing network traffic patterns

### 7. Gradient Area Chart (`gradient-area`)
**Best for:** Traffic flow visualization with visual appeal

**Characteristics:**
- Multi-color gradient transitions
- Purple to cyan to green gradient
- Enhanced visual impact
- Smooth color blending

**Use Cases:**
- Premium dashboard displays
- Executive summaries
- Marketing presentations
- High-visibility monitors

**Visual Example:** Purple-cyan-green gradient with sawtooth pattern

### 8. Multi-Line Chart (`multi-line`)
**Best for:** Performance correlation analysis

**Characteristics:**
- Multiple metrics on same chart
- Different line styles (solid, dashed, dotted)
- Color-coded metrics
- Overlay comparison

**Use Cases:**
- Request rate vs response time vs success rate
- Multi-dimensional performance monitoring
- Correlation analysis
- Comparative trending

**Visual Example:** Orange solid, red dashed, green dotted lines

### 2. Line Chart (`line`)
**Best for:** Transaction rates, response times, success rates

**Characteristics:**
- Clean, minimal line representation
- Good for showing trends and patterns
- Easy to read precise values
- Multiple lines can be overlaid

**Use Cases:**
- Transaction per second (TPS)
- Response time trends
- Success/error rates
- Temperature monitoring

**Visual Example:** Orange line showing transaction volume over time

### 3. Bar Chart (`bar`)
**Best for:** Discrete events, request counts, categorical data

**Characteristics:**
- Discrete vertical bars
- Good for comparing values across time periods
- Shows individual data points clearly
- Emphasizes specific moments/events

**Use Cases:**
- Request counts per minute
- Error counts
- Event occurrences
- Batch job completions

**Visual Example:** Green bars showing request volume spikes

### 4. Scatter Plot (`scatter`)
**Best for:** Latency distribution, correlation analysis, outlier detection

**Characteristics:**
- Individual data points as dots
- Good for showing distribution patterns
- Helps identify outliers and clusters
- Shows data density

**Use Cases:**
- Response time distribution
- Latency patterns
- Performance outliers
- Correlation between metrics

**Visual Example:** Purple dots showing RTT distribution patterns

### 5. Step Chart (`step`)
**Best for:** State changes, threshold monitoring, discrete levels

**Characteristics:**
- Step-like transitions between values
- Good for showing state changes
- Emphasizes discrete levels
- Clear transitions between states

**Use Cases:**
- Service availability states
- Configuration changes
- Threshold crossings
- Status level changes

**Visual Example:** Cyan steps showing success rate levels

### 6. Composed Chart (`composed`)
**Best for:** Multi-metric correlation, complex relationships

**Characteristics:**
- Combines bars and lines
- Shows multiple metrics simultaneously
- Good for correlation analysis
- More complex but information-rich

**Use Cases:**
- Request volume (bars) + response time (line)
- Throughput vs latency correlation
- Multi-dimensional monitoring
- Performance relationship analysis

**Visual Example:** Orange bars (requests) + red line (RTT)

### 9. Stacked Bar Chart (`stacked-bar`)
**Best for:** Resource usage breakdown, component analysis

**Characteristics:**
- Multiple metrics stacked vertically
- Shows total and component values
- Color-coded segments
- Good for part-to-whole relationships

**Use Cases:**
- CPU/Memory/Disk usage breakdown
- Request types distribution
- Error categories analysis
- Resource allocation visualization

**Visual Example:** Blue, orange, red stacked segments

### 10. Bubble Chart (`bubble`)
**Best for:** Correlation analysis, outlier detection

**Characteristics:**
- Multiple scatter series
- Different colored bubbles
- Shows distribution patterns
- Good for multi-dimensional data

**Use Cases:**
- Response time vs request rate correlation
- Performance outlier identification
- Service health distribution
- Capacity planning analysis

**Visual Example:** Purple and cyan bubbles with random walk pattern

### 11. Heatmap Chart (`heatmap`)
**Best for:** Activity patterns, intensity visualization

**Characteristics:**
- Color-coded intensity bars
- HSL color spectrum
- Dynamic color mapping
- Shows activity hotspots

**Use Cases:**
- Storage activity patterns
- Request intensity over time
- Error frequency visualization
- Performance hotspot identification

**Visual Example:** Rainbow-colored bars showing activity spikes

### 12. Radial Gradient Chart (`radial`)
**Best for:** Load distribution, circular patterns

**Characteristics:**
- Radial gradient fills
- Center-to-edge color transition
- Circular visual metaphor
- Eye-catching design

**Use Cases:**
- Load balancer distribution
- Circular process monitoring
- Executive dashboard highlights
- Premium visual displays

**Visual Example:** Orange-to-red radial gradient with logarithmic pattern

### 13. Waterfall Chart (`waterfall`)
**Best for:** Sequential changes, performance cascades

**Characteristics:**
- Color-coded positive/negative changes
- Sequential bar progression
- Shows cumulative effects
- Good for change analysis

**Use Cases:**
- Cache hit/miss progression
- Performance improvement tracking
- Sequential process monitoring
- Change impact analysis

**Visual Example:** Green/red bars showing cache performance cascade

### 14. Candlestick Chart (`candlestick`)
**Best for:** Complex metric relationships, trading-style data

**Characteristics:**
- Combines bars and multiple lines
- Trading chart aesthetic
- Multiple data series overlay
- Professional financial look

**Use Cases:**
- Queue depth analysis
- Performance range monitoring
- Multi-metric correlation
- Advanced analytics displays

**Visual Example:** Green bars with red and cyan lines showing queue metrics

### 15. Pulse Wave Chart (`pulse-wave`)
**Best for:** Burst activity patterns, rhythmic data flows

**Characteristics:**
- Gradient-filled area with overlay line
- Pulsing visual rhythm
- Glow effects and smooth transitions
- Dotted accent line with markers
- Three-color gradient (purple-cyan-green)

**Use Cases:**
- Storage I/O burst patterns
- Network traffic surges
- Batch processing cycles
- Rhythmic system activities

**Visual Example:** Purple-cyan gradient area with dotted cyan overlay line

## Data Patterns

### Normal Pattern (`normal`)
- Standard variation with realistic noise
- Simulates typical daily patterns
- Good baseline for comparison

### Spike Pattern (`spike`)
- Sharp increase in the middle of the timeline
- Simulates traffic spikes or incidents
- Good for testing alert visualization

### Step Pattern (`step`)
- Distinct level changes
- Simulates configuration changes or capacity adjustments
- Good for showing discrete state transitions

### Oscillating Pattern (`oscillating`)
- Sine wave-like variations
- Simulates cyclical patterns
- Good for showing periodic behavior

### Declining Pattern (`declining`)
- Gradual decrease over time
- Simulates degradation or capacity reduction
- Good for showing performance decline

### Recovering Pattern (`recovering`)
- Improvement from poor to good state
- Simulates incident recovery
- Good for showing system healing

### Sawtooth Pattern (`sawtooth`)
- Repeating triangular wave pattern
- Sharp rises followed by gradual falls
- Good for cyclical load patterns
- Simulates batch processing cycles

### Exponential Pattern (`exponential`)
- Exponential growth curve
- Accelerating increase over time
- Good for viral growth scenarios
- Simulates scaling events

### Logarithmic Pattern (`logarithmic`)
- Logarithmic growth curve
- Fast initial growth, then leveling
- Good for adoption curves
- Simulates learning effects

### Random Walk Pattern (`random-walk`)
- Unpredictable up/down movements
- Simulates noisy environments
- Good for stress testing visualizations
- Shows system under random load

### Heartbeat Pattern (`heartbeat`)
- Double-peak rhythm pattern
- Simulates biological rhythms
- Good for health monitoring
- Shows regular pulse-like activity

### Cascade Pattern (`cascade`)
- Step-down degradation pattern
- Simulates cascading failures
- Good for showing system degradation
- Progressive performance decline

### Pulse Burst Pattern (`pulse-burst`)
- Rhythmic burst activity with varying intensity
- Combines multiple sine wave frequencies
- Creates natural pulsing rhythm
- Good for I/O and batch processing visualization
- Simulates storage burst patterns

## Implementation Guidelines

### Chart Selection Criteria

1. **Data Type Consideration:**
   - Continuous metrics → Line/Area charts
   - Discrete events → Bar charts
   - Distribution data → Scatter plots
   - State changes → Step charts

2. **Visual Clarity:**
   - Single metric → Line/Area/Bar
   - Multiple metrics → Composed charts
   - Pattern emphasis → Choose based on data characteristics

3. **User Intent:**
   - Trend analysis → Line charts
   - Volume emphasis → Area/Bar charts
   - Outlier detection → Scatter plots
   - State monitoring → Step charts

### Configuration Example

\`\`\`typescript
const testCard: MonitorCardData = {
  id: "test-example",
  name: "[TEST] Service Monitor",
  type: "network",
  showMetrics: true,
  chartType: "gradient-area",        // Advanced chart type
  dataPattern: "sawtooth",           // Unique data pattern
  chartColors: {                     // Custom color scheme
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    accent: "#10b981"
  },
  chartStyle: {                      // Visual styling
    strokeWidth: 3,
    opacity: 0.8,
    glow: true
  },
  iconColor: "blue",
  statusColor: "green"
}
\`\`\`

## UI Design Evaluation

The TEST cards in the Monitor page showcase different chart types to help evaluate:

1. **Visual Hierarchy:** How different chart types affect card layout
2. **Information Density:** Which charts convey the most useful information
3. **Readability:** How easy it is to interpret different visualizations
4. **Aesthetic Appeal:** Which chart types fit best with the overall design

### Complete TEST Card Configuration Matrix

| Card | Chart Type | Data Pattern | Primary Color | Description |
|------|------------|--------------|---------------|-------------|
| Payment Gateway | gradient-area | sawtooth | Purple (#8b5cf6) | Multi-color gradient with triangular waves |
| Auth Service | multi-line | heartbeat | Orange (#f59e0b) | Three overlaid lines with pulse pattern |
| Database Monitor | stacked-bar | exponential | Blue (#3b82f6) | Stacked segments with growth curve |
| API Gateway | bubble | random-walk | Purple (#8b5cf6) | Dual scatter series with noise |
| Load Balancer | radial | logarithmic | Orange (#f59e0b) | Radial gradient with leveling curve |
| Cache Service | waterfall | cascade | Cyan (#06b6d4) | Sequential bars with step-down |
| Message Queue | candlestick | oscillating | Green (#10b981) | Trading-style with sine waves |
| File Storage | pulse-wave | pulse-burst | Purple (#8b5cf6) | Gradient area with dotted overlay |

### Visual Diversity Achieved

- **8 Unique Chart Types**: No duplicates, each with distinct visual characteristics
- **8 Unique Data Patterns**: Different mathematical functions and behaviors
- **Custom Color Schemes**: Carefully selected color combinations for each card
- **Varied Styling**: Different stroke widths, opacities, and visual effects

## Best Practices

1. **Consistency:** Use similar chart types for similar metrics across the dashboard
2. **Context:** Choose chart types that match the user's mental model of the data
3. **Performance:** Consider rendering performance for real-time updates
4. **Accessibility:** Ensure charts are readable and provide alternative text descriptions

## Future Enhancements

- **Interactive Charts:** Add hover tooltips and click interactions
- **Real-time Updates:** Implement live data streaming
- **Custom Patterns:** Allow users to define custom data patterns
- **Chart Combinations:** Support more complex chart combinations
- **Responsive Design:** Optimize charts for different screen sizes
