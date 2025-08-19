"use client"

import type React from "react"
import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
} from "lucide-react"
import { useRouter } from "next/navigation"
import MonitorCard, { MonitorCardData } from "@/components/shared/MonitorCard"
import Sidebar from "@/components/shared/Sidebar"
import Breadcrumb, { BREADCRUMB_CONFIGS } from "@/components/shared/Breadcrumb"

export default function MonitorListPage() {
  const router = useRouter()
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
      <Sidebar
        activeNavItem={activeNavItem}
        onNavItemChange={setActiveNavItem}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-12 overflow-hidden">
        {/* Top Navigation Bar with Breadcrumb */}
        <Breadcrumb items={BREADCRUMB_CONFIGS.monitor()} />

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">


            {/* Monitor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* New Monitor Card */}
              <Card
                className="hover:shadow-lg transition-all duration-200 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50"
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
