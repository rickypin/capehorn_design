"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import VisaPreview from "@/components/shared/VisaPreview"
import VisaHeader from "@/components/shared/VisaHeader"
import Sidebar from "@/components/shared/Sidebar"
import Breadcrumb, { BREADCRUMB_CONFIGS } from "@/components/shared/Breadcrumb"

export default function VisaServiceIntermediatePage() {
  const router = useRouter()
  const [activeNavItem, setActiveNavItem] = useState("Monitor")
  const [timeRange, setTimeRange] = useState("15m")
  const [isSimulatedData, setIsSimulatedData] = useState(false)
  const [scenario, setScenario] = useState("normal")

  return (
    <div className="flex h-screen bg-background">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeNavItem={activeNavItem}
        onNavItemChange={setActiveNavItem}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-12 overflow-hidden">
        {/* Top Navigation Bar with Breadcrumb */}
        <Breadcrumb items={BREADCRUMB_CONFIGS.visaServiceIntermediate()} />

        {/* VISA Header Controls */}
        <VisaHeader
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          isSimulatedData={isSimulatedData}
          onSimulatedDataChange={setIsSimulatedData}
          scenario={scenario}
          onScenarioChange={setScenario}
          badge={null}
        />

        {/* VISA Dashboard */}
        <div className="flex-1 overflow-y-auto">
          <VisaPreview
            className="h-full"
            hideHeader={true}
            timeRange={timeRange}
            isSimulatedData={isSimulatedData}
            scenario={scenario}
          />
        </div>
      </div>
    </div>
  )
}
