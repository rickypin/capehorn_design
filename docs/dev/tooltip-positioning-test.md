# Tooltip Positioning Test Guide

## Problem Solved

The original tooltip implementation had a critical UX issue where tooltips were constrained within card boundaries, causing them to block the chart content when users hovered over data points.

## Solution Overview

We implemented smart tooltip positioning that allows tooltips to escape card boundaries while maintaining proper visual hierarchy and preventing content obstruction.

## Testing Instructions

### 1. Visual Test - Monitor Dashboard
1. Navigate to `http://localhost:3002/monitor`
2. Hover over any chart in the monitor cards
3. **Expected Behavior**:
   - Tooltip appears near cursor without blocking chart content
   - Tooltip can extend beyond card boundaries when necessary
   - Tooltip follows cursor movement smoothly
   - No content obstruction occurs

### 2. Edge Case Testing
Test tooltip behavior at card edges:

#### Top Edge
- Hover near the top of any chart
- Tooltip should appear below cursor or adjust position automatically

#### Right Edge  
- Hover near the right edge of any chart
- Tooltip should appear to the left of cursor or adjust position

#### Bottom Edge
- Hover near the bottom of any chart
- Tooltip should appear above cursor or adjust position

#### Left Edge
- Hover near the left edge of any chart
- Tooltip should appear to the right of cursor or adjust position

### 3. Chart Type Coverage
Test all chart types for consistent tooltip behavior:

- ✅ **Area Charts** (VISA Service) - Network traffic visualization
- ✅ **Line Charts** (Transaction monitors) - Simple metrics
- ✅ **Multi-line Charts** (Auth Service) - Multiple metrics
- ✅ **Stacked Bar Charts** (Database Monitor) - Resource usage
- ✅ **Bubble Charts** (API Gateway) - Correlation analysis
- ✅ **Gradient Area Charts** (Payment Gateway) - Enhanced visuals
- ✅ **Radial Charts** (Load Balancer) - Distribution patterns
- ✅ **Waterfall Charts** (Cache Service) - Sequential data
- ✅ **Candlestick Charts** (Message Queue) - Complex metrics
- ✅ **Pulse Wave Charts** (File Storage) - Burst patterns

### 4. Responsive Testing
Test tooltip behavior across different screen sizes:

#### Desktop (1920x1080)
- Tooltips should have adequate space to display
- No content blocking should occur

#### Tablet (768x1024)
- Tooltips should adapt to smaller card sizes
- Smart positioning should prevent edge overflow

#### Mobile (375x667)
- Tooltips should remain readable
- Touch interaction should work properly

## Technical Verification

### 1. CSS Classes Applied
Verify these classes are present:

```css
/* Chart Container */
.overflow-visible  /* Allows tooltip overflow */
.relative         /* Positioning context */

/* Tooltip Content */
.z-50            /* High z-index for layering */
.max-w-[250px]   /* Maximum width constraint */
.min-w-[200px]   /* Minimum width constraint */
```

### 2. Recharts Configuration
Verify tooltip configuration includes:

```typescript
{
  allowEscapeViewBox: { x: true, y: true },
  offset: 15,
  position: { x: undefined, y: undefined },
  wrapperStyle: { 
    zIndex: 9999,
    pointerEvents: 'none'
  }
}
```

### 3. Browser Developer Tools
1. Open browser developer tools
2. Hover over chart to trigger tooltip
3. Inspect tooltip element
4. Verify:
   - Tooltip is positioned outside card boundaries when needed
   - Z-index is properly set (9999)
   - No CSS overflow constraints are blocking display

## Success Criteria

✅ **No Content Blocking**: Tooltips never obstruct chart data  
✅ **Smart Positioning**: Tooltips adjust position based on cursor location  
✅ **Boundary Escape**: Tooltips can extend beyond card edges  
✅ **Visual Hierarchy**: Tooltips appear above all other content  
✅ **Smooth Interaction**: No lag or flickering during hover  
✅ **Consistent Behavior**: All chart types behave identically  
✅ **Responsive Design**: Works across all screen sizes  

## Common Issues & Solutions

### Issue: Tooltip Still Blocked
**Solution**: Check that `overflow-visible` is applied to chart container

### Issue: Tooltip Appears Behind Content
**Solution**: Verify z-index is set to 9999 in tooltip configuration

### Issue: Tooltip Doesn't Follow Cursor
**Solution**: Ensure `position: { x: undefined, y: undefined }` is set

### Issue: Tooltip Flickers
**Solution**: Confirm `pointerEvents: 'none'` is applied to tooltip wrapper

## Performance Considerations

- Tooltips use `backdrop-blur-sm` for visual appeal without heavy performance impact
- `pointerEvents: 'none'` prevents unnecessary event handling
- Minimal DOM manipulation ensures smooth hover interactions
- CSS transforms used for positioning to leverage GPU acceleration

## Accessibility Notes

- Tooltips provide additional context for screen readers
- Color indicators help users with visual impairments
- High contrast maintained in both light and dark themes
- Keyboard navigation support through chart focus states
