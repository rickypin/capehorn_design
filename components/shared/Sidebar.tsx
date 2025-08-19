"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, BarChart3, Monitor as MonitorIcon, Settings } from "lucide-react"

interface SidebarProps {
  activeNavItem?: string
  onNavItemChange?: (item: string) => void
}

export default function Sidebar({ 
  activeNavItem = "Monitor", 
  onNavItemChange 
}: SidebarProps) {
  const router = useRouter()

  const handleNavItemClick = (item: string) => {
    onNavItemChange?.(item)
    
    // Handle navigation
    switch (item) {
      case "Monitor":
        router.push("/monitor")
        break
      case "Home":
        router.push("/")
        break
      default:
        break
    }
  }

  return (
    <div className="w-12 flex flex-col bg-card border-r border-border fixed left-0 top-0 h-full z-30">
      {/* Navigation Items */}
      <div className="flex flex-col items-center py-3 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
          onClick={() => handleNavItemClick("Home")}
          title="Home"
        >
          <Search className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
          title="Analytics"
        >
          <BarChart3 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`h-9 w-9 p-0 transition-colors duration-150 ${
            activeNavItem === "Monitor"
              ? "text-primary bg-muted/50 hover:bg-muted/70"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
          onClick={() => handleNavItemClick("Monitor")}
          title="Monitor"
        >
          <MonitorIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
