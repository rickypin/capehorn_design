"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, BarChart3, Monitor as MonitorIcon, Settings, Layers } from "lucide-react"

// Unified Props Interface Pattern
export interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  isActive?: boolean
  isDisabled?: boolean
}

interface SidebarProps {
  // New unified interface
  items?: SidebarItem[]
  activeItem?: string
  onItemSelect?: (item: SidebarItem) => void
  onNavigate?: (href: string) => void
  className?: string

  // Legacy interface (deprecated but maintained for backward compatibility)
  /** @deprecated Use items and onItemSelect instead */
  activeNavItem?: string
  /** @deprecated Use items and onItemSelect instead */
  onNavItemChange?: (item: string) => void
}

export default function Sidebar({
  // New unified props
  items,
  activeItem,
  onItemSelect,
  onNavigate,
  className = "",

  // Legacy props (deprecated)
  activeNavItem = "Monitor",
  onNavItemChange
}: SidebarProps) {
  const router = useRouter()

  // Default sidebar items (used when items prop is not provided)
  const defaultItems: SidebarItem[] = [
    {
      id: "Home",
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      id: "Analytics",
      label: "Analytics",
      icon: BarChart3,
      isDisabled: true,
    },
    {
      id: "Monitor",
      label: "Monitor",
      icon: MonitorIcon,
      href: "/monitor",
    },
    {
      id: "CardDemo",
      label: "Card Demo",
      icon: Layers,
      href: "/card-demo",
    },
    {
      id: "Settings",
      label: "Settings",
      icon: Settings,
      isDisabled: true,
    },
  ]

  // Use provided items or fall back to default
  const sidebarItems = items || defaultItems

  // Determine active item (new interface takes precedence)
  const currentActiveItem = activeItem || activeNavItem

  // Unified event handler
  const handleItemClick = (item: SidebarItem) => {
    if (item.isDisabled) return

    // New unified interface
    if (onItemSelect) {
      onItemSelect(item)
    }

    // Legacy interface support
    if (onNavItemChange) {
      onNavItemChange(item.id)
    }

    // Handle navigation
    if (item.href) {
      if (onNavigate) {
        onNavigate(item.href)
      } else {
        // Default navigation behavior
        router.push(item.href)
      }
    }
  }

  return (
    <div className={`w-12 flex flex-col bg-card border-r border-border fixed left-0 top-0 h-full z-30 ${className}`}>
      {/* Navigation Items */}
      <div className="flex flex-col items-center py-3 space-y-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon
          const isActive = currentActiveItem === item.id
          const isDisabled = item.isDisabled

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              disabled={isDisabled}
              className={`h-9 w-9 p-0 transition-colors duration-150 ${
                isActive
                  ? "text-primary bg-muted/50 hover:bg-muted/70"
                  : isDisabled
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
              }`}
              onClick={() => handleItemClick(item)}
              title={item.label}
            >
              <IconComponent className="h-4 w-4" />
            </Button>
          )
        })}
      </div>
    </div>
  )
}
