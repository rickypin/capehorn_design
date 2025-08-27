"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import {
  Monitor,
  Activity,
  Shield,
  ExternalLink,
  CreditCard,
  Plus,
  Layers,
  Settings
} from "lucide-react"
import Sidebar from "@/components/shared/Sidebar"
import Breadcrumb from "@/components/shared/Breadcrumb"

export default function HomePage() {
  const router = useRouter()
  const [activeNavItem, setActiveNavItem] = useState("Home")

  const handlePageNavigation = (path: string) => {
    router.push(path)
  }

  const navigationPages = [
    {
      category: "Main Pages",
      pages: [
        {
          name: "Home",
          description: "Dashboard overview and platform introduction",
          path: "/",
          icon: Shield,
          status: "current"
        },
        {
          name: "Monitor Dashboard",
          description: "View all active monitors and their status",
          path: "/monitor",
          icon: Monitor,
          status: "active"
        },
        {
          name: "Create Monitor",
          description: "Set up new monitoring services",
          path: "/monitor/create",
          icon: Plus,
          status: "active"
        }
      ]
    },
    {
      category: "Monitor Services",
      pages: [
        {
          name: "VISA Service",
          description: "Network monitoring for VISA payment service",
          path: "/monitor/visa_service",
          icon: CreditCard,
          status: "active"
        },
        {
          name: "VISA Service (Intermediate)",
          description: "Transaction monitoring for VISA intermediate service",
          path: "/monitor/visa_service_intermediate",
          icon: CreditCard,
          status: "active"
        }
      ]
    },
    {
      category: "Development Tools",
      pages: [
        {
          name: "Card Components Demo",
          description: "Showcase of MonitorCard component variations",
          path: "/card-demo",
          icon: Layers,
          status: "dev"
        },
        {
          name: "Corner Radius Demo",
          description: "Corner radius system testing and examples",
          path: "/corner-demo",
          icon: Settings,
          status: "dev"
        },
        {
          name: "Tooltip Demo",
          description: "Tooltip component testing and examples",
          path: "/tooltip-demo",
          icon: Activity,
          status: "dev"
        }
      ]
    }
  ]

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
        <Breadcrumb items={[{ label: "Home", isActive: true }]} />

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">

            {/* Page Navigation */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                Available Pages & Navigation
              </h2>
              <div className="space-y-8">
                {navigationPages.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {category.category}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.pages.map((page, pageIndex) => (
                        <Card
                          key={pageIndex}
                          className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${
                            page.status === 'current'
                              ? 'ring-2 ring-primary/50 bg-primary/5'
                              : page.status === 'dev'
                              ? 'border-orange-200 bg-orange-50/50'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => handlePageNavigation(page.path)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                page.status === 'current'
                                  ? 'bg-primary/20 text-primary'
                                  : page.status === 'dev'
                                  ? 'bg-orange-100 text-orange-600'
                                  : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                              } transition-colors duration-200`}>
                                <page.icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                                    {page.name}
                                  </h4>
                                  {page.status === 'current' && (
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                      Current
                                    </span>
                                  )}
                                  {page.status === 'dev' && (
                                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                                      Dev
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {page.description}
                                </p>
                                <div className="text-xs text-muted-foreground/70 mt-2 font-mono">
                                  {page.path}
                                </div>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors duration-200" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
