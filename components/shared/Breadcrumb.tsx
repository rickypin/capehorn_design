"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

// Unified Props Interface Pattern
export interface BreadcrumbItem {
  id?: string
  label: string
  href?: string
  isActive?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onItemClick?: (item: BreadcrumbItem) => void
  onNavigate?: (href: string) => void
  className?: string
}

export default function Breadcrumb({
  items,
  onItemClick,
  onNavigate,
  className = ""
}: BreadcrumbProps) {
  const router = useRouter()

  const handleNavigation = (href: string) => {
    if (onNavigate) {
      onNavigate(href)
    } else {
      // Default navigation behavior
      router.push(href)
    }
  }

  const handleItemClick = (item: BreadcrumbItem) => {
    // Call the item click callback
    onItemClick?.(item)

    // Handle navigation if href is provided
    if (item.href) {
      handleNavigation(item.href)
    }
  }

  return (
    <div className={`sticky top-0 z-20 bg-card border-b border-border ${className}`}>
      <div className="px-6 py-3">
        <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
          {/* Home Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors duration-150 rounded cursor-pointer"
            onClick={() => handleNavigation("/")}
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Button>

          {/* Breadcrumb Items */}
          {items.map((item, index) => {
            const ItemIcon = item.icon
            const itemKey = item.id || `breadcrumb-${index}`

            return (
              <div key={itemKey} className="flex items-center space-x-2">
                <span className="text-muted-foreground/70">/</span>
                {item.href && !item.isActive ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 py-1 text-foreground font-medium hover:text-primary hover:bg-muted/50 transition-colors duration-150 rounded cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-center gap-1">
                      {ItemIcon && <ItemIcon className="h-3 w-3" />}
                      {item.label}
                    </div>
                  </Button>
                ) : (
                  <span className={`font-medium px-2 py-1 cursor-default flex items-center gap-1 ${
                    item.isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}>
                    {ItemIcon && <ItemIcon className="h-3 w-3" />}
                    {item.label}
                  </span>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
