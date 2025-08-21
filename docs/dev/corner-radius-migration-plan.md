# Corner Radius Migration Plan

## Migration Mapping (就近原则)

基于就近原则，将现有圆角映射到新的圆角规范：

### Legacy to New Corner Mapping

| Legacy Class | Pixel Value | Nearest New Corner | New Pixel Value | Migration |
|--------------|-------------|-------------------|-----------------|-----------|
| `rounded-none` | 0px | `corner-none` | 0px | ✅ Exact match |
| `rounded-sm` | 2px | `corner-xs` | 4px | ⬆️ Slightly larger |
| `rounded` | 4px | `corner-xs` | 4px | ✅ Exact match |
| `rounded-md` | 6px | `corner-xs` | 4px | ⬇️ Slightly smaller (就近原则) |
| `rounded-lg` | 8px | `corner-sm` | 8px | ✅ Exact match |
| `rounded-xl` | 12px | `corner-md` | 12px | ✅ Exact match |
| `rounded-2xl` | 16px | `corner-lg` | 16px | ✅ Exact match |
| `rounded-3xl` | 24px | `corner-lg-plus` | 20px | ⬇️ Slightly smaller (就近原则) |
| `rounded-full` | ∞ | `corner-full` | ∞ | ✅ Exact match |

### Special Cases

| Current Usage | Context | Recommended Migration |
|---------------|---------|----------------------|
| `rounded` (4px) | Small elements, badges | `corner-xs` (4px) |
| `rounded-md` (6px) | Buttons, inputs | `corner-xs` (4px) - 就近更小 |
| `rounded-lg` (8px) | Icon containers | `corner-sm` (8px) |
| `rounded-xl` (12px) | Cards | `corner-md` (12px) |
| `rounded-2xl` (16px) | Large cards | `corner-lg` (16px) |
| `rounded-full` | Avatars, status dots | `corner-full` |

## Files to Migrate

### UI Components (Priority 1) - ✅ COMPLETED
1. ✅ `components/ui/card.tsx` - `rounded-xl` → `corner-md` (12px)
2. ✅ `components/ui/button.tsx` - `rounded-md` → `corner-xs` (4px)
3. ✅ `components/ui/badge.tsx` - `rounded-md` → `corner-xs` (4px)
4. ✅ `components/ui/avatar.tsx` - `rounded-full` → `corner-full`
5. ✅ `components/ui/textarea.tsx` - `rounded-md` → `corner-xs` (4px)
6. ✅ `components/ui/switch.tsx` - `rounded-full` → `corner-full`
7. ✅ `components/ui/progress.tsx` - `rounded-full` → `corner-full`

### Shared Components (Priority 2) - ✅ COMPLETED
1. ✅ `components/shared/MonitorCard.tsx` - Multiple rounded classes migrated:
   - Icon containers: `rounded-lg` → `corner-sm` (8px)
   - Status badges: `rounded-full` → `corner-full`
   - Chart containers: `rounded-lg` → `corner-sm` (8px)
   - Time labels: `rounded` → `corner-xs` (4px)
2. ✅ `components/shared/VisaPreview.tsx` - Multiple rounded classes migrated:
   - Section containers: `rounded-lg` → `corner-sm` (8px)
   - Status indicators: `rounded-full` → `corner-full`
   - Health badges: `rounded` → `corner-xs` (4px)

### Application Pages (Priority 3) - ✅ COMPLETED
1. ✅ `app/monitor/create/page.tsx` - Multiple rounded classes migrated:
   - Suggestion chips: `rounded-lg` → `corner-sm` (8px)
   - Input container: `rounded-xl` → `corner-md` (12px)

### Demo Components (Priority 4)
1. ⏭️ `components/examples/CornerRadiusDemo.tsx` - Keep legacy examples for comparison

## Migration Strategy

### Phase 1: Core UI Components
- Start with most frequently used components
- Ensure no visual breaking changes
- Test component library consistency

### Phase 2: Shared Components
- Update business logic components
- Maintain design consistency
- Update component documentation

### Phase 3: Application Pages
- Update page-level styling
- Ensure responsive behavior
- Test user experience

### Phase 4: Cleanup
- Remove unused legacy classes
- Update documentation
- Performance optimization

## Testing Checklist

### Visual Regression Testing
- [ ] Button components in all variants
- [ ] Card components in all sizes
- [ ] Form elements (inputs, textareas)
- [ ] Navigation elements
- [ ] Status indicators and badges

### Responsive Testing
- [ ] Mobile viewport (320px+)
- [ ] Tablet viewport (768px+)
- [ ] Desktop viewport (1024px+)
- [ ] Large screens (1440px+)

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

## Implementation Notes

### Automated Migration Script
```bash
# Find and replace patterns (for reference)
# rounded-xl → corner-md (12px)
# rounded-lg → corner-sm (8px)
# rounded-md → corner-xs (4px)
# rounded-full → corner-full
```

### Manual Review Required
- Complex className combinations
- Conditional rounded classes
- Dynamic styling with template literals
- Responsive rounded classes

### Rollback Plan
- Keep git commits atomic per component
- Maintain legacy system in parallel
- Document any visual changes
- Prepare quick rollback procedures

## Success Criteria

### Functional Requirements
- ✅ All components render correctly
- ✅ No layout shifts or visual breaks
- ✅ Responsive behavior maintained
- ✅ Accessibility preserved

### Performance Requirements
- ✅ No increase in bundle size
- ✅ CSS specificity maintained
- ✅ Build time not affected

### Design Requirements
- ✅ Visual consistency maintained
- ✅ Design system alignment
- ✅ User experience preserved

## Post-Migration Tasks

### Documentation Updates
- [ ] Update component documentation
- [ ] Update design system guidelines
- [ ] Create migration guide for future developers

### Team Communication
- [ ] Share migration results with team
- [ ] Update coding standards
- [ ] Schedule design review session

### Monitoring
- [ ] Monitor for any reported issues
- [ ] Track performance metrics
- [ ] Gather user feedback

## Risk Assessment

### Low Risk
- ✅ Exact pixel matches (rounded-lg → corner-sm)
- ✅ Full rounded elements (rounded-full → corner-full)

### Medium Risk
- ⚠️ Slight pixel differences (rounded-md → corner-xs)
- ⚠️ Complex component interactions

### High Risk
- 🔴 Custom border-radius CSS properties
- 🔴 Third-party component overrides

## Completion Status

### ✅ Completed
- [x] Migration plan created
- [x] Mapping table established
- [x] Risk assessment completed
- [x] UI components migration (7/7 components)
- [x] Shared components migration (2/2 components)
- [x] Application pages migration (1/1 pages)
- [x] Core migration implementation

### 🔄 In Progress
- [x] Testing and validation (visual inspection)
- [ ] Comprehensive browser testing
- [ ] Performance validation

### ⏳ Pending
- [ ] Documentation updates
- [ ] Team review and approval
- [ ] Production deployment
