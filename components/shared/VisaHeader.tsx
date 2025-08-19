"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// i18n dictionary (same as VisaPreview)
const DICT = {
  "en-US": {
    title: "VISA Service Performance Monitor",
    realData: "Real Data",
    simulatedData: "Simulated Data",
    network_incident: "Network Incident",
    app_incident: "Application Incident", 
    crossborder_jitter: "Cross-border Jitter",
    retrans_storm: "Retransmission Storm",
    last_5m: "Last 5 min",
    last_15m: "Last 15 min",
    last_1h: "Last 1 hour",
    last_4h: "Last 4 hours",
    badge_network: "Network Issue Pattern",
    badge_app: "Application Issue Pattern",
    badge_crossborder: "Cross-border Issue Pattern",
    badge_retrans: "Retransmission Pattern",
  },
  "zh-CN": {
    title: "VISA 服务性能监控",
    realData: "真实数据",
    simulatedData: "模拟数据",
    network_incident: "网络故障",
    app_incident: "应用故障",
    crossborder_jitter: "跨境抖动",
    retrans_storm: "重传风暴",
    last_5m: "最近 5 分钟",
    last_15m: "最近 15 分钟", 
    last_1h: "最近 1 小时",
    last_4h: "最近 4 小时",
    badge_network: "网络问题模式",
    badge_app: "应用问题模式",
    badge_crossborder: "跨境问题模式",
    badge_retrans: "重传模式",
  }
}

interface VisaHeaderProps {
  timeRange: string
  onTimeRangeChange: (value: string) => void
  isSimulatedData: boolean
  onSimulatedDataChange: (checked: boolean) => void
  scenario: string
  onScenarioChange: (value: string) => void
  badge?: { text: string; color: string } | null
  locale?: string
}

export default function VisaHeader({
  timeRange,
  onTimeRangeChange,
  isSimulatedData,
  onSimulatedDataChange,
  scenario,
  onScenarioChange,
  badge,
  locale = "en-US"
}: VisaHeaderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const t = (key: string): string => {
    return DICT[locale as keyof typeof DICT]?.[key as keyof typeof DICT["en-US"]] || key
  }

  return (
    <div className="sticky top-[52px] z-10 p-4 border-b border-border bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t("title")}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("realData")}</span>
              <Switch
                checked={isSimulatedData}
                onCheckedChange={(checked) => {
                  onSimulatedDataChange(checked)
                  if (!checked) {
                    onScenarioChange("normal")
                  } else {
                    onScenarioChange("network")
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">{t("simulatedData")}</span>
            </div>

            {isSimulatedData && (
              <Select value={scenario} onValueChange={onScenarioChange}>
                <SelectTrigger className="w-48 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="network">{t("network_incident")}</SelectItem>
                  <SelectItem value="app">{t("app_incident")}</SelectItem>
                  <SelectItem value="crossborder">{t("crossborder_jitter")}</SelectItem>
                  <SelectItem value="retrans">{t("retrans_storm")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">{t("last_5m")}</SelectItem>
              <SelectItem value="15m">{t("last_15m")}</SelectItem>
              <SelectItem value="1h">{t("last_1h")}</SelectItem>
              <SelectItem value="4h">{t("last_4h")}</SelectItem>
            </SelectContent>
          </Select>

          {badge && (
            <Badge
              variant={badge.color === "red" ? "destructive" : badge.color === "orange" ? "secondary" : "default"}
              className={
                badge.color === "gray" ? "bg-muted text-muted-foreground" :
                badge.color === "blue" ? "bg-blue-100 text-blue-700 border-blue-200" :
                badge.color === "purple" ? "bg-purple-100 text-purple-700 border-purple-200" : ""
              }
            >
              {badge.text}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
