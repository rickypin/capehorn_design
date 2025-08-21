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
    // UI Layout Test Cards - 8 additional cards for design testing
    {
      id: "test-3",
      name: "[TEST] Payment Gateway Service with Very Long Title That Should Wrap",
      status: "active",
      lastUpdated: "1 minute ago",
      route: "payment_gateway_test",
      type: "network",
      showMetrics: true,
      iconColor: "blue",
      statusColor: "green",
      description: "UI Layout Test Card"
    },
    {
      id: "test-4",
      name: "[TEST] Auth Service",
      status: "warning",
      lastUpdated: "3 minutes ago",
      route: "auth_service_test",
      type: "transaction",
      showMetrics: true,
      iconColor: "orange",
      statusColor: "orange",
      description: "UI Layout Test Card"
    },
    {
      id: "test-5",
      name: "[TEST] Database Monitor",
      status: "active",
      lastUpdated: "7 minutes ago",
      route: "database_test",
      type: "network",
      showMetrics: true,
      iconColor: "blue",
      statusColor: "green",
      description: "UI Layout Test Card"
    },
    {
      id: "test-6",
      name: "[TEST] API Gateway",
      status: "error",
      lastUpdated: "12 minutes ago",
      route: "api_gateway_test",
      type: "transaction",
      showMetrics: true,
      iconColor: "orange",
      statusColor: "red",
      description: "UI Layout Test Card"
    },
    {
      id: "test-7",
      name: "[TEST] Load Balancer",
      status: "active",
      lastUpdated: "4 minutes ago",
      route: "load_balancer_test",
      type: "network",
      showMetrics: true,
      iconColor: "blue",
      statusColor: "green",
      description: "UI Layout Test Card"
    },
    {
      id: "test-8",
      name: "[TEST] Cache Service",
      status: "warning",
      lastUpdated: "8 minutes ago",
      route: "cache_service_test",
      type: "transaction",
      showMetrics: true,
      iconColor: "orange",
      statusColor: "orange",
      description: "UI Layout Test Card"
    },
    {
      id: "test-9",
      name: "[TEST] Message Queue",
      status: "active",
      lastUpdated: "6 minutes ago",
      route: "message_queue_test",
      type: "network",
      showMetrics: true,
      iconColor: "blue",
      statusColor: "green",
      description: "UI Layout Test Card"
    },
    {
      id: "test-10",
      name: "[TEST] File Storage",
      status: "active",
      lastUpdated: "10 minutes ago",
      route: "file_storage_test",
      type: "transaction",
      showMetrics: true,
      iconColor: "orange",
      statusColor: "green",
      description: "UI Layout Test Card"
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
          {/* Monitor Grid */}
          <div className="monitor-grid-responsive">
            {/* Existing Monitor Cards */}
            {monitors.map((monitor) => (
              <MonitorCard
                key={monitor.id}
                monitor={monitor}
                onClick={handleMonitorClick}
              />
            ))}

            {/* New Monitor Card */}
            <Card
              className="hover:shadow-lg transition-all duration-200 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50 monitor-card-size"
              onClick={handleCreateNew}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-4">
                <div className="w-16 h-16 corner-sm bg-muted flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground text-center">Create New Monitor</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
