# Development Routes

This directory contains development-only routes that are used for testing, demos, and development purposes.

## Route Group Behavior

The `(dev)` folder is a Next.js route group. Route groups:
- Do not affect the URL structure
- Allow organization of routes without adding path segments
- Can be used to conditionally include/exclude routes

## Available Demo Routes

### Component Demos
- `/card-demo` - MonitorCard component demonstrations
- `/corner-demo` - Corner radius system testing
- `/tooltip-demo` - Tooltip component testing

### Testing Routes  
- `/debug-scrolling` - Scrolling behavior testing
- `/test-container-query` - Container query testing
- `/test-scrolling` - Additional scrolling tests
- `/tooltip-portal-test` - Tooltip portal testing

## Production Deployment

For production deployment, you can:

1. **Exclude this directory entirely** by adding to `.gitignore` or build scripts
2. **Use environment-based conditional rendering** in components
3. **Configure Next.js to ignore these routes** in production builds

## Usage

These routes are accessible in development at:
- `http://localhost:3000/card-demo`
- `http://localhost:3000/corner-demo`
- etc.

## Maintenance

- Keep demo routes updated with main component changes
- Remove obsolete test routes
- Document new demo routes added to this directory
