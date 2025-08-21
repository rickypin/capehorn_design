# Corner Radius System Documentation

## Overview

This document describes the new corner radius control system implemented alongside the existing legacy radius system. The new system is designed with Material Design 3 principles and provides more granular control over corner rounding.

## System Architecture

### Two Parallel Systems

1. **Legacy System** (prefix: `radius-`, `rounded-`)
   - Based on Tailwind's default radius system
   - Uses `--radius: 0.5rem` as base value
   - Classes: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`

2. **New Corner System** (prefix: `corner-`)
   - Material Design 3 inspired
   - Uses `--corner-base: 1rem` (16px) as configurable base value
   - More granular scale with 10 distinct sizes

## New Corner Radius Scale

### CSS Variables

```css
/* Base Configuration */
--corner-base: 1rem; /* 16px - User configurable (Large) */

/* Complete Scale */
--corner-none: 0;                                      /* 0dp - No rounding */
--corner-xs: 0.25rem;                                 /* 4dp - Extra small */
--corner-sm: 0.5rem;                                  /* 8dp - Small */
--corner-md: 0.75rem;                                 /* 12dp - Medium */
--corner-lg: var(--corner-base);                      /* 16dp - Large (base) */
--corner-lg-plus: calc(var(--corner-base) + 0.25rem); /* 20dp - Large increased */
--corner-xl: calc(var(--corner-base) + 0.75rem);      /* 28dp - Extra large */
--corner-xl-plus: calc(var(--corner-base) + 1rem);    /* 32dp - Extra large increased */
--corner-2xl: calc(var(--corner-base) + 2rem);        /* 48dp - Extra extra large */
--corner-full: 9999px;                                /* Fully rounded corners */
```

### CSS Classes

#### All Corners
```css
.corner-none     /* 0px */
.corner-xs       /* 4px */
.corner-sm       /* 8px */
.corner-md       /* 12px */
.corner-lg       /* 16px - Base */
.corner-lg-plus  /* 20px */
.corner-xl       /* 28px */
.corner-xl-plus  /* 32px */
.corner-2xl      /* 48px */
.corner-full     /* Fully rounded */
```

#### Directional Variants
```css
/* Top corners */
.corner-t-{size}

/* Bottom corners */
.corner-b-{size}

/* Left corners */
.corner-l-{size}

/* Right corners */
.corner-r-{size}
```

## Usage Guidelines

### When to Use Each System

#### Legacy System (`rounded-*`)
- **Continue using** for existing components
- **Maintain compatibility** with current designs
- **Small adjustments** to existing layouts

#### New Corner System (`corner-*`)
- **New components** and features
- **Design system alignment** with Material Design 3
- **Precise control** over corner radius
- **User-configurable** corner preferences

### Recommended Mappings

| Component Type | Recommended Corner Class | Pixel Value |
|----------------|-------------------------|-------------|
| Small buttons | `corner-sm` | 8px |
| Standard buttons | `corner-md` | 12px |
| Cards | `corner-lg` | 16px |
| Large cards | `corner-xl` | 28px |
| Modal dialogs | `corner-xl-plus` | 32px |
| Hero sections | `corner-2xl` | 48px |
| Avatars/badges | `corner-full` | Fully rounded |
| Input fields | `corner-sm` | 8px |
| Chips/tags | `corner-md` | 12px |

## Configuration

### Changing the Base Value

Users can customize the corner radius scale by modifying the base variable:

```css
:root {
  --corner-base: 1.25rem; /* 20px - Larger base */
}
```

This will automatically scale all related corner sizes:
- `corner-lg-plus` becomes 25px
- `corner-xl` becomes 32px
- `corner-xl-plus` becomes 36px
- `corner-2xl` becomes 52px

### Theme Integration

The corner system integrates with the existing theme system and supports:
- **Light/Dark mode** compatibility
- **CSS variable** inheritance
- **Runtime customization**

## Migration Strategy

### Phase 1: Parallel Implementation
- ✅ New system implemented alongside legacy
- ✅ No breaking changes to existing code
- ✅ Documentation and guidelines established

### Phase 2: Gradual Adoption (Recommended)
- Use new system for **new components**
- **Optionally migrate** high-impact components
- Maintain **backward compatibility**

### Phase 3: Full Migration (Optional)
- Systematic replacement of legacy classes
- Update component libraries
- Remove legacy system (if desired)

## Examples

### Basic Usage
```tsx
// New system
<div className="corner-lg bg-card p-4">
  Card with 16px corners
</div>

// Legacy system (still works)
<div className="rounded-xl bg-card p-4">
  Card with 12px corners
</div>
```

### Directional Corners
```tsx
// Rounded top only
<div className="corner-t-lg corner-b-none">
  Header section
</div>

// Rounded left only
<div className="corner-l-md corner-r-none">
  Sidebar panel
</div>
```

### Dynamic Corner Sizing
```tsx
// Using CSS variables directly
<div style={{ borderRadius: 'var(--corner-xl)' }}>
  Custom component
</div>
```

### Using Utility Functions
```tsx
import { cornerClasses, componentCorner, cornerStyle } from "@/lib/corner-utils"

// Component-based corner sizing
<Button className={componentCorner("button-default")}>
  Standard Button
</Button>

// Multiple corner configurations
<div className={cornerClasses([
  { size: "lg", direction: "t" },
  { size: "none", direction: "b" }
])}>
  Header with top corners only
</div>

// Inline styles with corner utilities
<div style={cornerStyle("xl", "t")}>
  Custom styled component
</div>

// Responsive corners
<div className={responsiveCorner({
  default: "sm",
  md: "lg",
  lg: "xl"
})}>
  Responsive corner sizing
</div>
```

## Browser Support

- **Modern browsers**: Full support
- **CSS Variables**: Required (IE11+ support)
- **calc() function**: Required (IE9+ support)
- **Fallback**: Legacy system provides compatibility

## Performance Considerations

- **CSS Variables**: Minimal performance impact
- **calc() functions**: Computed at parse time
- **Class generation**: No runtime overhead
- **Bundle size**: ~2KB additional CSS

## Troubleshooting

### Common Issues

1. **Corner not applying**: Check CSS specificity
2. **Variable not found**: Ensure proper CSS import order
3. **Inconsistent sizing**: Verify base variable value

### Debugging

```css
/* Check computed values */
.debug-corners {
  border: 1px solid red;
  background: rgba(255, 0, 0, 0.1);
}
```

## Future Enhancements

- **Responsive corners**: Different sizes per breakpoint
- **Animation support**: Smooth corner transitions
- **Component presets**: Pre-configured corner combinations
- **Design tokens**: Integration with design system tools
