"use client"

import CornerRadiusDemo from "@/components/examples/CornerRadiusDemo"
import Sidebar from "@/components/shared/Sidebar"

export default function CornerDemoPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeNavItem="Demo" />
      
      {/* Main Content */}
      <div className="flex-1 ml-12">
        <CornerRadiusDemo />
      </div>
    </div>
  )
}
