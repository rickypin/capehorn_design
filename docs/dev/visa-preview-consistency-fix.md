# VISA Preview Consistency Fix (2024-08-21) ✅

## Problem Description

User reported inconsistency between two pages:
1. `/monitor/create` page Preview mode
2. `/monitor/visa_service` page

The issue was that `/monitor/visa_service` page showed duplicate "Real Data ↔ Simulated Data" toggle controls:
- One in the `VisaHeader` component
- Another in the `VisaPreview` component

While `/monitor/create` page Preview only showed the toggle in `PreviewHeader`, with `VisaPreview` having `hideDataControls={true}`.

## Root Cause Analysis

The inconsistency occurred because:

1. **`/monitor/create` page (Preview mode)**:
   - Uses `PreviewHeader` for data controls
   - Uses `VisaPreview` with `hideDataControls={true}` 
   - Result: Single data toggle in preview header

2. **`/monitor/visa_service` page**:
   - Uses `VisaHeader` with data controls visible
   - Uses `VisaPreview` with `hideDataControls={true}` (after our fix)
   - Result: Single data toggle in page header

3. **Before fix**: `/monitor/visa_service` had `hideDataControls={false}` in `VisaPreview`, causing duplicate controls.

## Solution Applied

### 1. Enhanced `VisaHeader` Component
- **File**: `components/shared/VisaHeader.tsx`
- **Added**: `hideDataControls?: boolean` prop (default: `false`)
- **Logic**: Conditionally render data toggle controls based on this prop

```tsx
interface VisaHeaderProps {
  // ... existing props
  hideDataControls?: boolean // New prop to hide data toggle controls
}

// In render logic:
{!hideDataControls && (
  <div className="flex items-center gap-4">
    {/* Data toggle controls */}
  </div>
)}
```

### 2. Updated Page Configurations

#### `/monitor/visa_service/page.tsx`
```tsx
<VisaHeader
  // ... other props
  hideDataControls={true}  // Hide duplicate controls in header
/>

<VisaPreview
  hideHeader={true}
  hideDataControls={false}  // Show controls in preview body
  // ... other props
/>
```

#### `/monitor/visa_service_intermediate/page.tsx`
```tsx
<VisaHeader
  // ... other props  
  hideDataControls={true}  // Hide duplicate controls in header
/>

<VisaPreview
  hideHeader={true}
  hideDataControls={false}  // Show controls in preview body
  // ... other props
/>
```

#### `/monitor/create/page.tsx` (unchanged)
```tsx
<PreviewHeader
  // Data controls handled here
/>

<VisaPreview
  hideDataControls={true}  // Hide controls in preview body
  // ... other props
/>
```

## Result

Now all pages have consistent behavior:
- **Single data toggle control** per page
- **Same visual appearance** of VISA Service Performance Monitor
- **Consistent user experience** across different page contexts

## Design Principles Established

### 1. **Single Source of Truth for Data Controls**
Each page should have exactly one place for data toggle controls:
- Preview pages: In `PreviewHeader`
- Full pages: In `VisaPreview` component body

### 2. **Component Prop Consistency**
- `hideHeader`: Controls entire header visibility
- `hideDataControls`: Controls only data toggle controls visibility
- These props work independently and can be combined

### 3. **Future-Proof Pattern**
When adding new pages with VISA preview:

```tsx
// For full-page VISA views:
<VisaHeader hideDataControls={true} />
<VisaPreview hideHeader={true} hideDataControls={false} />

// For preview/modal contexts:
<PreviewHeader />
<VisaPreview hideDataControls={true} />
```

## Files Modified

### ✅ Component Files
1. **`components/shared/VisaHeader.tsx`**
   - Added `hideDataControls` prop
   - Added conditional rendering logic

### ✅ Page Files  
1. **`app/monitor/visa_service/page.tsx`**
   - Added `hideDataControls={true}` to `VisaHeader`
   - Changed `hideDataControls={false}` in `VisaPreview`

2. **`app/monitor/visa_service_intermediate/page.tsx`**
   - Added `hideDataControls={true}` to `VisaHeader`
   - Changed `hideDataControls={false}` in `VisaPreview`

### ✅ Unchanged Files
1. **`app/monitor/create/page.tsx`** - Already correctly configured
2. **`components/shared/VisaPreview.tsx`** - No changes needed
3. **`components/shared/PreviewHeader.tsx`** - No changes needed

## Testing Checklist

- [ ] `/monitor/visa_service` shows single data toggle in VISA preview body
- [ ] `/monitor/visa_service_intermediate` shows single data toggle in VISA preview body  
- [ ] `/monitor/create` preview shows single data toggle in preview header
- [ ] All data toggles function correctly (Real ↔ Simulated Data)
- [ ] Scenario dropdowns appear when simulated data is enabled
- [ ] Time range selectors work independently of data toggles

## Maintenance Notes

**When adding new VISA-related pages:**
1. Decide where data controls should appear (header vs body)
2. Use appropriate `hideDataControls` props to avoid duplication
3. Follow the established patterns documented above
4. Test for visual consistency with existing pages

**When modifying data control logic:**
1. Update both `VisaHeader` and `VisaPreview` components
2. Ensure prop interfaces remain consistent
3. Test all pages that use these components
