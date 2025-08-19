"use client"

import { useRouter } from "next/navigation"
import VisaPreview from "@/components/shared/VisaPreview"

export default function VisaServiceIntermediatePage() {
  const router = useRouter()

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar with Breadcrumb */}
        <div className="sticky top-0 z-20 bg-card border-b border-border">
          <div className="px-6 py-3">
            <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/")}
              >
                Home
              </button>
              <span className="text-muted-foreground">/</span>
              <button
                className="text-foreground font-medium hover:bg-muted px-2 py-1 rounded"
                onClick={() => router.push("/monitor")}
              >
                Monitor
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground font-medium">
                VISA Service (Intermediate)
              </span>
            </nav>
          </div>
        </div>

        {/* VISA Dashboard */}
        <div className="flex-1">
          <VisaPreview />
        </div>
      </div>
    </div>
  )
}
