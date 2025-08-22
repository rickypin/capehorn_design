# Panel Border Color System Update

## Overview
Updated the VISA Service Performance Monitor dashboard to ensure all small panels use border colors that match their parent layer's color scheme, creating a more cohesive visual hierarchy.

## Changes Made

### Layer 1: Transaction Processing Health
**Color Scheme**: Warm neutral with amber hints
- Background: `--layer-1-bg` (#fefcf3)
- Border: `--layer-1-border` (#f3e8ab)
- Text: `--layer-1-text` (#92400e)
- Accent: `--layer-1-accent` (#d97706)

**Updated Panels**:
1. **Core Transaction Metrics** - Already using `var(--layer-1-border)` ✅
2. **Response Code Distribution** - Updated from `border-green-200 dark:border-green-700` to `var(--layer-1-border)` ✅
3. **Transaction Health Summary** - Updated from `border-green-200 dark:border-green-700` to `var(--layer-1-border)` ✅

### Layer 2: Network Transmission Health
**Color Scheme**: Cool neutral with slate hints
- Background: `--layer-2-bg` (#f8fafc)
- Border: `--layer-2-border` (#cbd5e1)
- Text: `--layer-2-text` (#475569)
- Accent: `--layer-2-accent` (#64748b)

**Updated Panels**:
1. **End-to-End Latency** - Already using `var(--layer-2-border)` ✅
2. **Packet Loss & Retransmission** - Updated from `border-blue-200 dark:border-blue-700` to `var(--layer-2-border)` ✅
3. **Traffic & Connections** - Already using `var(--layer-2-border)` ✅
4. **Network Health Summary** - Updated from `border-blue-200 dark:border-blue-700` to `var(--layer-2-border)` ✅

### Layer 3: Cross-Layer Correlation Diagnostics
**Color Scheme**: Neutral with indigo hints
- Background: `--layer-3-bg` (#faf9ff)
- Border: `--layer-3-border` (#e0e7ff)
- Text: `--layer-3-text` (#4338ca)
- Accent: `--layer-3-accent` (#6366f1)

**Panels Status**:
1. **Success Rate vs Network Latency** - Already using `var(--layer-3-border)` ✅
2. **Packet Loss vs Response Time** - Already using `var(--layer-3-border)` ✅

## Implementation Details

### Before
```tsx
// Inconsistent hardcoded colors
<Card className="border-green-200 dark:border-green-700">
<Card className="border-blue-200 dark:border-blue-700">
```

### After
```tsx
// Consistent layer-based colors
<Card style={{ borderColor: `var(--layer-1-border)` }} className="border">
<Card style={{ borderColor: `var(--layer-2-border)` }} className="border">
```

## Preserved Semantic Colors

The following cards intentionally retain their semantic colors as they represent diagnostic patterns rather than layer-specific content:

1. **Network Issue Pattern** - Red (`border-red-200`) for network problems
2. **Application Issue Pattern** - Orange (`border-orange-200`) for application problems  
3. **Cross-border Issue Pattern** - Blue (`border-blue-200`) for cross-border issues

## Benefits

1. **Visual Hierarchy**: Clear visual grouping of related panels within each layer
2. **Consistency**: Unified color language across the dashboard
3. **Maintainability**: Centralized color management through CSS custom properties
4. **Accessibility**: Proper contrast ratios maintained in both light and dark modes
5. **Professional Appearance**: Clean, cohesive design suitable for enterprise monitoring

## Files Modified

- `components/shared/VisaPreview.tsx` - Updated panel border colors to use layer-specific CSS custom properties

## Shadow Removal Update

### Additional Changes Made
Removed shadows from all small panels within the layers to create a cleaner, flatter design while maintaining visual hierarchy through borders and colors.

**Small Panels with Shadows Removed**:
- Layer 1: Core Transaction Metrics, Response Code Distribution
- Layer 2: End-to-End Latency, Packet Loss & Retransmission, Traffic & Connections
- Layer 3: Success Rate vs Network Latency, Packet Loss vs Response Time

**Panels that Retain Shadows**:
- Large layer container panels (Layer 1, Layer 2, Layer 3)
- Health Overview summary cards (Network Health, Transaction Health)
- Diagnostic pattern cards (Network Issue, Application Issue, Cross-border Issue)
- All other dashboard cards and components

### Implementation
```tsx
// Before: Default shadow from Card component
<Card style={{ borderColor: `var(--layer-1-border)` }} className="border">

// After: Explicitly remove shadow for small panels
<Card style={{ borderColor: `var(--layer-1-border)` }} className="border shadow-none">
```

## Testing

The changes have been tested in the development environment at `http://localhost:3002/monitor/visa_service` and the visual hierarchy now properly reflects the layer-based organization with cleaner, shadow-free small panels.
