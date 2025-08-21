/**
 * Corner Radius System Utilities
 * 
 * This module provides utility functions and types for working with
 * the new corner radius system alongside the existing radius system.
 */

import { type ClassValue } from "clsx"
import { cn } from "@/lib/utils"

// Corner radius size types
export type CornerSize = 
  | "none" 
  | "xs" 
  | "sm" 
  | "md" 
  | "lg" 
  | "lg-plus" 
  | "xl" 
  | "xl-plus" 
  | "2xl" 
  | "full"

// Directional corner types
export type CornerDirection = "t" | "b" | "l" | "r"

// Corner radius configuration
export interface CornerConfig {
  size: CornerSize
  direction?: CornerDirection
}

/**
 * Corner size to pixel value mapping (based on default --corner-base: 1rem)
 */
export const CORNER_SIZES: Record<CornerSize, string> = {
  none: "0px",
  xs: "4px",
  sm: "8px", 
  md: "12px",
  lg: "16px",      // Base size
  "lg-plus": "20px",
  xl: "28px",
  "xl-plus": "32px",
  "2xl": "48px",
  full: "9999px"
}

/**
 * Generate corner radius class name
 */
export function cornerClass(size: CornerSize, direction?: CornerDirection): string {
  const base = `corner-${size}`
  return direction ? `corner-${direction}-${size}` : base
}

/**
 * Generate multiple corner classes with conditional logic
 */
export function cornerClasses(
  config: CornerConfig | CornerConfig[] | CornerSize,
  ...additionalClasses: ClassValue[]
): string {
  let cornerClassNames: string[] = []

  if (typeof config === "string") {
    // Simple size string
    cornerClassNames.push(cornerClass(config))
  } else if (Array.isArray(config)) {
    // Array of configurations
    cornerClassNames = config.map(c => cornerClass(c.size, c.direction))
  } else {
    // Single configuration object
    cornerClassNames.push(cornerClass(config.size, config.direction))
  }

  return cn(...cornerClassNames, ...additionalClasses)
}

/**
 * Get CSS variable name for corner size
 */
export function cornerVariable(size: CornerSize): string {
  return `var(--corner-${size})`
}

/**
 * Generate inline style object for corner radius
 */
export function cornerStyle(size: CornerSize, direction?: CornerDirection): React.CSSProperties {
  const value = cornerVariable(size)
  
  if (!direction) {
    return { borderRadius: value }
  }

  switch (direction) {
    case "t":
      return {
        borderTopLeftRadius: value,
        borderTopRightRadius: value
      }
    case "b":
      return {
        borderBottomLeftRadius: value,
        borderBottomRightRadius: value
      }
    case "l":
      return {
        borderTopLeftRadius: value,
        borderBottomLeftRadius: value
      }
    case "r":
      return {
        borderTopRightRadius: value,
        borderBottomRightRadius: value
      }
    default:
      return { borderRadius: value }
  }
}

/**
 * Component size to recommended corner size mapping
 */
export const COMPONENT_CORNER_MAP: Record<string, CornerSize> = {
  // Buttons
  "button-sm": "sm",
  "button-default": "md", 
  "button-lg": "md",
  
  // Cards
  "card-sm": "md",
  "card-default": "lg",
  "card-lg": "xl",
  
  // Input fields
  "input": "sm",
  "textarea": "sm",
  "select": "sm",
  
  // Badges and chips
  "badge": "md",
  "chip": "md",
  "tag": "sm",
  
  // Avatars
  "avatar": "full",
  
  // Modals and overlays
  "modal": "xl-plus",
  "popover": "lg",
  "tooltip": "sm",
  
  // Navigation
  "nav-item": "sm",
  "tab": "sm",
  
  // Containers
  "container": "lg",
  "section": "xl",
  "hero": "2xl"
}

/**
 * Get recommended corner size for component type
 */
export function getComponentCorner(componentType: string): CornerSize {
  return COMPONENT_CORNER_MAP[componentType] || "md"
}

/**
 * Create corner class with component-based defaults
 */
export function componentCorner(
  componentType: string, 
  override?: CornerSize,
  direction?: CornerDirection
): string {
  const size = override || getComponentCorner(componentType)
  return cornerClass(size, direction)
}

/**
 * Responsive corner utilities
 */
export interface ResponsiveCorner {
  default: CornerSize
  sm?: CornerSize
  md?: CornerSize
  lg?: CornerSize
  xl?: CornerSize
}

/**
 * Generate responsive corner classes
 */
export function responsiveCorner(config: ResponsiveCorner): string {
  const classes: string[] = [cornerClass(config.default)]
  
  if (config.sm) classes.push(`sm:${cornerClass(config.sm)}`)
  if (config.md) classes.push(`md:${cornerClass(config.md)}`)
  if (config.lg) classes.push(`lg:${cornerClass(config.lg)}`)
  if (config.xl) classes.push(`xl:${cornerClass(config.xl)}`)
  
  return cn(...classes)
}

/**
 * Corner animation utilities
 */
export function cornerTransition(duration: string = "200ms"): React.CSSProperties {
  return {
    transition: `border-radius ${duration} ease-in-out`
  }
}

/**
 * Validate corner size
 */
export function isValidCornerSize(size: string): size is CornerSize {
  return Object.keys(CORNER_SIZES).includes(size)
}

/**
 * Convert legacy rounded class to new corner class
 */
export const LEGACY_TO_CORNER_MAP: Record<string, CornerSize> = {
  "rounded-none": "none",
  "rounded-sm": "xs",
  "rounded": "sm",
  "rounded-md": "md", 
  "rounded-lg": "lg",
  "rounded-xl": "xl",
  "rounded-2xl": "2xl",
  "rounded-full": "full"
}

/**
 * Convert legacy rounded class to new corner class
 */
export function legacyToCorner(legacyClass: string): string {
  const size = LEGACY_TO_CORNER_MAP[legacyClass]
  return size ? cornerClass(size) : legacyClass
}

/**
 * Debug utility to show all corner sizes
 */
export function debugCornerSizes(): void {
  console.table(
    Object.entries(CORNER_SIZES).map(([size, pixels]) => ({
      Size: size,
      Pixels: pixels,
      ClassName: cornerClass(size as CornerSize),
      Variable: cornerVariable(size as CornerSize)
    }))
  )
}
