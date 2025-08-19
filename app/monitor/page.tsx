"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  MonitorIcon,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react"
import { useRouter } from "next/navigation"
import MonitorCard, { MonitorCardData } from "@/components/shared/MonitorCard"

export default function MonitorListPage() {
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeNavItem, setActiveNavItem] = useState("Monitor")

  // Sample monitor data - in a real app this would come from an API
  const monitors: MonitorCardData[] = [
    {
      id: "1",
      name: "VISA Service",
      status: "active",
      lastUpdated: "2 minutes ago",
      route: "visa_service",
      type: "network",
      showMetrics: true,
      iconColor: "blue",
      statusColor: "green",
    },
    {
      id: "2",
      name: "VISA Service (Intermediate)",
      status: "active",
      lastUpdated: "5 minutes ago",
      route: "visa_service_intermediate",
      type: "transaction",
      showMetrics: true,
      iconColor: "orange",
      statusColor: "green",
    },
  ]

  const handleCreateNew = () => {
    // Navigate to the new monitor creation page
    router.push("/monitor/create")
  }

  const handleMonitorClick = (monitor: MonitorCardData) => {
    // Navigate to the monitor's route
    if (monitor.route) {
      router.push(`/monitor/${monitor.route}`)
    }
  }

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
              <span className="text-foreground font-medium">Monitor</span>
            </nav>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">


            {/* Monitor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* New Monitor Card */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50"
                onClick={handleCreateNew}
              >
                <CardContent className="flex flex-col items-center justify-center h-48 p-6">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground text-center">Create New Monitor</h3>
                </CardContent>
              </Card>

              {/* Existing Monitor Cards */}
              {monitors.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  monitor={monitor}
                  onClick={handleMonitorClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
