"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const router = useRouter()

  const handleNavigation = (href: string) => {
    router.push(href)
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
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-muted-foreground/70">/</span>
              {item.href && !item.isActive ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 py-1 text-foreground font-medium hover:text-primary hover:bg-muted/50 transition-colors duration-150 rounded cursor-pointer"
                  onClick={() => handleNavigation(item.href!)}
                >
                  {item.label}
                </Button>
              ) : (
                <span className={`font-medium px-2 py-1 cursor-default ${
                  item.isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

// Utility function to generate common breadcrumb patterns
export const createMonitorBreadcrumb = (currentPage?: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = []

  if (currentPage) {
    // If there's a current page, Monitor is clickable
    items.push({ label: "Monitor", href: "/monitor" })
    items.push({ label: currentPage, isActive: true })
  } else {
    // If no current page, Monitor is the current page
    items.push({ label: "Monitor", isActive: true })
  }

  return items
}

// Pre-defined breadcrumb configurations
export const BREADCRUMB_CONFIGS = {
  monitor: () => createMonitorBreadcrumb(),
  monitorCreate: () => createMonitorBreadcrumb("New Monitor"),
  visaService: () => createMonitorBreadcrumb("VISA Service"),
  visaServiceIntermediate: () => createMonitorBreadcrumb("VISA Service Performance Monitoring"),
}
