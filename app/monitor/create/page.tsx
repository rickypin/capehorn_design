"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Home, Shield, Monitor as MonitorIcon } from "lucide-react"

export default function NewMonitorPage() {
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeNavItem, setActiveNavItem] = useState("Monitor")

  return (
    <div className="flex h-screen bg-background">
      {/* Left Navigation Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out flex flex-col border-r border-border bg-card`}>
        {/* Navigation Header */}
        <div className="p-4 border-b border-border">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!sidebarCollapsed && (
              <h2 className="font-semibold text-foreground">Navigation</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 p-0"
              title={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-2">
          <nav className="space-y-2">
            <Button
              variant={activeNavItem === "Sentire" ? "default" : "ghost"}
              className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start px-3'}`}
              onClick={() => setActiveNavItem("Sentire")}
              title={sidebarCollapsed ? "Sentire" : undefined}
            >
              <Shield className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Sentire</span>}
            </Button>
            <Button
              variant={activeNavItem === "Monitor" ? "default" : "ghost"}
              className={`w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start px-3'}`}
              onClick={() => setActiveNavItem("Monitor")}
              title={sidebarCollapsed ? "Monitor" : undefined}
            >
              <MonitorIcon className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Monitor</span>}
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar with Breadcrumb */}
        <div className="sticky top-0 z-20 bg-card border-b border-border">
          <div className="px-6 py-3">
            <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/")}
              >
                <Home className="h-4 w-4" />
              </Button>
              <span className="text-muted-foreground">/</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-foreground font-medium hover:bg-muted"
                onClick={() => router.push("/monitor")}
              >
                Monitor
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">New Monitor</span>
            </nav>
          </div>
        </div>

        {/* Content Area Below Breadcrumb */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Content Area - Same structure as VISA monitor but empty */}
          <div className="w-72 flex flex-col border-r border-border bg-sidebar">
            {/* Header placeholder - maintaining structure */}
            <div className="p-4 border-b border-sidebar-border bg-card">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <MonitorIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-sidebar-foreground">New Monitor</h1>
                  <p className="text-sm text-muted-foreground">Setup Dashboard</p>
                </div>
              </div>
            </div>

            {/* Content area - keeping structure but empty */}
            <div className="flex-1 p-4">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Configure your new monitor settings here</p>
              </div>
            </div>
          </div>

          {/* Main Dashboard Area - Empty but maintaining structure */}
          <div className="flex-1 bg-background flex flex-col">
            {/* Dashboard Header - maintaining structure */}
            <div className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-border">
              <div className="px-6 py-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-lg flex items-center gap-2">
                    <MonitorIcon className="h-6 w-6 text-primary" />
                    New Monitor Dashboard
                  </span>
                </div>
              </div>
            </div>

            {/* Empty Dashboard Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MonitorIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">Dashboard Area</h3>
                  <p className="text-sm">This area will contain your monitor dashboard once configured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
