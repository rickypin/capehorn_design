# Monitor Card Unified Diagonal Texture System

## Overview
Simplified the texture-based design system for monitor card icons to use a single, elegant diagonal stripe pattern across all icons, maintaining visual consistency while preserving service type differentiation through icon shapes.

## Design Principles

### 1. **Unified Texture Design**
- Single diagonal stripe pattern for all icons
- Consistent visual language across the interface
- Simplified design complexity while maintaining elegance

### 2. **Square Frame Consistency**
- Maintain 48x48px (w-12 h-12) square container
- Consistent corner radius using `corner-sm`
- Subtle border for definition

### 3. **Icon-Based Differentiation**
- Service types distinguished by icon shapes (Lucide icons)
- Auto-detection based on service names
- Unified diagonal texture as visual background
- Manual override capability via `iconType` field

## Icon Mapping with Unified Texture

### Available Icons
| Icon Type | Lucide Icon | Use Case | Texture |
|-----------|-------------|----------|---------|
| `credit-card` | CreditCard | Payment services, VISA, financial | Diagonal stripes |
| `database` | Database | Database services, SQL, storage | Diagonal stripes |
| `server` | Server | API services, gateways, web servers | Diagonal stripes |
| `zap` | Zap | Load balancers, traffic management | Diagonal stripes |
| `shield` | Shield | Authentication, security services | Diagonal stripes |
| `cpu` | Cpu | Cache services, memory, processing | Diagonal stripes |
| `message` | MessageSquare | Message queues, communication | Diagonal stripes |
| `storage` | HardDrive | File storage, blob storage, S3 | Diagonal stripes |
| `network` | Network | Network services, CDN, proxy | Diagonal stripes |
| `chart` | BarChart3 | Analytics, monitoring services | Diagonal stripes |
| `cloud` | Cloud | Cloud services, distributed systems | Diagonal stripes |
| `lock` | Lock | Security, encryption services | Diagonal stripes |
| `activity` | Activity | General monitoring, health checks | Diagonal stripes |

### Auto-Detection Rules
The system automatically assigns icons based on service names:

\`\`\`typescript
// Payment services
if (name.includes('visa') || name.includes('payment')) return CreditCard

// Database services  
if (name.includes('database') || name.includes('db')) return Database

// API services
if (name.includes('api') || name.includes('gateway')) return Server

// Load balancing
if (name.includes('load') || name.includes('balancer')) return Zap

// Authentication
if (name.includes('auth') || name.includes('security')) return Shield

// Cache services
if (name.includes('cache') || name.includes('redis')) return Cpu

// Message queues
if (name.includes('message') || name.includes('queue')) return MessageSquare

// File storage
if (name.includes('file') || name.includes('storage')) return HardDrive

// Network services
if (name.includes('network') || name.includes('cdn')) return Network
\`\`\`

## Texture Pattern Details

### Pattern Descriptions
- **Diagonal Stripes**: 45-degree diagonal lines for payment services
- **Grid Pattern**: Subtle grid overlay for database services
- **Dot Pattern**: Radial dot pattern for API services
- **Zigzag Pattern**: Angular zigzag for load balancing
- **Hexagon Overlay**: Hexagonal shape for security services
- **Wave Pattern**: Repeating wave lines for cache services
- **Circle Pattern**: Multiple circle overlays for messaging
- **Line Pattern**: Vertical line pattern for storage
- **Mesh Pattern**: Cross-hatch mesh for network services
- **Default Gradient**: Simple gradient for general services

### Base Color Scheme
- **Background**: `bg-slate-50` - Light neutral background
- **Text**: `text-slate-700` - Dark text for contrast
- **Border**: `border-slate-200` - Subtle border definition
- **Pattern Color**: `rgba(148, 163, 184, 0.05-0.15)` - Very subtle pattern overlay

### Design Features
- Consistent neutral color base across all icons
- Texture patterns provide visual differentiation
- No color-based categorization to avoid alert confusion
- Subtle opacity levels maintain professional appearance

## Usage

### Manual Icon Assignment
\`\`\`typescript
{
  id: "payment-service",
  name: "Payment Gateway",
  iconType: "credit-card", // Will use diagonal stripe pattern
  // ... other properties
}
\`\`\`

### Automatic Assignment
\`\`\`typescript
{
  id: "db-service",
  name: "Database Monitor", // Auto-detects as database icon with grid pattern
  // ... other properties
}
\`\`\`

### Pattern Override
\`\`\`typescript
{
  id: "custom-service",
  name: "Custom Service",
  iconType: "server", // Explicitly use server icon with dot pattern
  // ... other properties
}
\`\`\`

## Implementation Details

### Component Changes
- Enhanced `MonitorCardData` interface with `iconType` field
- Added `getMonitorIcon()` function for icon resolution
- Replaced `getIconColorClass()` with `getIconStyleClass()` for texture patterns
- Added CSS texture classes in `globals.css`
- Applied changes to both enhanced and simple card variants

### CSS Texture Implementation
- 10 unique texture patterns using CSS backgrounds and pseudo-elements
- Consistent neutral color base (`slate-50` background, `slate-700` text)
- Subtle pattern overlays with low opacity
- Z-index management to ensure icons appear above patterns

### Backward Compatibility
- Existing monitors without `iconType` use auto-detection
- Fallback to `MonitorIcon` for unrecognized types
- Removed dependency on `iconColor` field (now uses texture patterns)

## Examples

### Current Monitor Cards with Texture Patterns
1. **VISA Service**: Credit card icon with diagonal stripe pattern
2. **Database Monitor**: Database icon with grid pattern
3. **API Gateway**: Server icon with dot pattern
4. **Auth Service**: Shield icon with hexagon overlay
5. **Cache Service**: CPU icon with wave pattern
6. **Message Queue**: Message icon with circle pattern
7. **File Storage**: Hard drive icon with line pattern
8. **Load Balancer**: Zap icon with zigzag pattern

This texture-based system provides visual variety through patterns while maintaining a consistent neutral color scheme and avoiding confusion with system alert states.
