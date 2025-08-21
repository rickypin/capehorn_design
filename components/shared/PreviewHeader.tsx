"use client"

import React from "react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PreviewHeaderProps {
  isSimulatedData: boolean
  onSimulatedDataChange: (checked: boolean) => void
  scenario: string
  onScenarioChange: (scenario: string) => void
  onClose: () => void
}

export default function PreviewHeader({
  isSimulatedData,
  onSimulatedDataChange,
  scenario,
  onScenarioChange,
  onClose
}: PreviewHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
      {/* Left side - Preview title */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Preview</span>
      </div>

      {/* Right side - Data toggle switches and close button */}
      <div className="flex items-center gap-4">
        {/* Data Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Real Data</span>
          <Switch
            checked={isSimulatedData}
            onCheckedChange={(checked) => {
              onSimulatedDataChange(checked)
              if (!checked) {
                onScenarioChange("normal")
              } else {
                // Set default to "network" when switching to simulated data
                onScenarioChange("network")
              }
            }}
            className="scale-75"
          />
          <span className="text-xs text-muted-foreground">Simulated Data</span>
        </div>

        {/* Scenario Selector - only show when simulated data is enabled */}
        {isSimulatedData && (
          <Select value={scenario} onValueChange={onScenarioChange}>
            <SelectTrigger className="w-36 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="network">Network Incident</SelectItem>
              <SelectItem value="app">App/Dependency Incident</SelectItem>
              <SelectItem value="crossborder">Cross-border Jitter</SelectItem>
              <SelectItem value="retrans">Retransmission Storm</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-7 w-7 p-0 hover:bg-muted cursor-pointer"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
