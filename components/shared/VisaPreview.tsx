"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Activity,
  Wifi,
  BarChart3,
  TrendingUp,
  Globe,
} from "lucide-react"
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts"

// i18n Dictionary for VISA Dashboard
const DICT = {
  "zh-CN": {
    title: "VISA Service",
    timeRange: "时间窗",
    // Time range options with "Last" prefix
    last_5m: "最近 5 分钟",
    last_15m: "最近 15 分钟",
    last_1h: "最近 1 小时",
    last_4h: "最近 4 小时",
    scenario: "场景",
    realData: "真实数据",
    simulatedData: "模拟数据",
    scenario_normal: "场景：正常",
    scenario_network: "场景：网络异常",
    scenario_app: "场景：应用异常",
    scenario_crossborder: "场景：跨境路由抖动",
    scenario_retrans: "场景：重传风暴",
    // Simplified versions without "Scenario:" prefix for dropdown
    network_incident: "网络异常",
    app_incident: "应用异常",
    crossborder_jitter: "跨境路由抖动",
    retrans_storm: "重传风暴",
    nhi: "NHI 网络影响",
    thi: "THI 交易健康",
    card_latency: "端到端延迟 P50/P95/P99 (ms)",
    filterable: "可刷选",
    card_loss_retrans: "丢包率 / TCP 重传率 (%)",
    dual_axis: "双轴",
    card_bitrate_conn: "入/出站比特率 + 并发连接数",
    area_line: "面积+线",
    kpi_title: "交易验证区（KPI 与返回码分布）",
    legend_hint: "点击图例可高亮",
    req: "请求数 (rps)",
    succRate: "成功率 (%)",
    respP95: "响应时间 P95 (ms)",
    errRate: "错误率 (5xx+超时, %)",
    latest: "最新",
    success: "成功",
    fourxx: "4xx",
    fivexx: "5xx",
    timeout: "超时",
    corr_title_1: "成功率 vs 网络延迟（双轴诊断）",
    corr_read_1: "蓝色虚线为 99.5% SLA 基准",
    corr_title_2: "丢包率 vs 响应时间（气泡图）",
    corr_read_2: "气泡大小代表重传率",
    bar_title: "响应时间分布（按返回码分组）",
    weighted_avg: "加权平均",
    footer: "数据来源：VISA 网络监控系统",
    badge_network: "网络异常",
    badge_app: "应用异常",
    badge_crossborder: "跨境抖动",
    badge_retrans: "重传风暴",
    badge_normal: "正常",
  },
  "en-US": {
    title: "VISA Service Performance Monitor",
    timeRange: "Time Range",
    // Time range options with "Last" prefix
    last_5m: "Last 5 min",
    last_15m: "Last 15 min",
    last_1h: "Last 1 hour",
    last_4h: "Last 4 hours",
    scenario: "Scenario",
    realData: "Real Data",
    simulatedData: "Simulated Data",
    scenario_normal: "Scenario: Normal",
    scenario_network: "Scenario: Network Incident",
    scenario_app: "Scenario: App/Dependency Incident",
    scenario_crossborder: "Scenario: Cross-border Jitter",
    scenario_retrans: "Scenario: Retransmission Storm",
    // Simplified versions without "Scenario:" prefix for dropdown
    network_incident: "Network Incident",
    app_incident: "App/Dependency Incident",
    crossborder_jitter: "Cross-border Jitter",
    retrans_storm: "Retransmission Storm",
    nhi: "Network Health Index",
    thi: "Transaction Health Index",
    card_latency: "End-to-end Latency P50/P95/P99 (ms)",
    filterable: "Filterable",
    card_loss_retrans: "Packet Loss / TCP Retransmission (%)",
    dual_axis: "Dual Axis",
    card_bitrate_conn: "Ingress/Egress Bitrate + Concurrent Connections",
    area_line: "Area + Line",
    kpi_title: "Transaction Validation (KPIs & Response Codes)",
    legend_hint: "Click legend to highlight",
    req: "Requests (rps)",
    succRate: "Success Rate (%)",
    respP95: "Response Time P95 (ms)",
    errRate: "Error Rate (5xx+timeout, %)",
    latest: "Latest",
    success: "Success",
    fourxx: "4xx",
    fivexx: "5xx",
    timeout: "Timeout",
    corr_title_1: "Success Rate vs Network Latency (Dual Axis)",
    corr_read_1: "Blue dashed line is 99.5% SLA baseline",
    corr_title_2: "Packet Loss vs Response Time (Bubble Chart)",
    corr_read_2: "Bubble size represents retransmission rate",
    bar_title: "Response Time Distribution (Grouped by Response Code)",
    weighted_avg: "Weighted Average",
    footer: "Data Source: VISA Network Monitoring System",
    badge_network: "Network Issue",
    badge_app: "App Issue",
    badge_crossborder: "Cross-border Jitter",
    badge_retrans: "Retransmission Storm",
    badge_normal: "Normal",
  },
}

// i18n Hook
function useI18n(defaultLocale: string = "en-US") {
  const [locale, setLocale] = useState(defaultLocale)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const t = (key: string): string => {
    return DICT[locale as keyof typeof DICT]?.[key as keyof typeof DICT["en-US"]] || key
  }

  const nfmt = (value: number, options?: Intl.NumberFormatOptions) => {
    if (!isClient) return value.toString()
    return new Intl.NumberFormat(locale, options).format(value)
  }

  const tfmt = (date: Date) => {
    if (!isClient) return date.toISOString()
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  return { locale, setLocale, t, nfmt, tfmt, isClient }
}

// Data generation and utility functions
function genSeries({ minutes, scenario, tfmt }: { minutes: number; scenario: string; tfmt: (date: Date) => string }) {
  const now = Date.now()
  const data = []

  for (let i = minutes; i >= 0; i--) {
    const ts = now - i * 60 * 1000
    const time = tfmt(new Date(ts))

    let baseRtt = 120
    let baseLoss = 0.1
    let baseRetrans = 1.0
    let baseConn = 800
    let baseInMbps = 180
    let baseOutMbps = 120
    let baseReq = 300
    let baseSuccessRate = 99.7
    let baseRespP95 = 350
    let baseErrorRate = 0.2

    // Apply scenario-specific modifications
    if (scenario === "network") {
      if (i <= 20) {
        baseRtt += Math.random() * 200 + 100
        baseLoss += Math.random() * 2 + 1
        baseRetrans += Math.random() * 5 + 2
        baseSuccessRate -= Math.random() * 5 + 2
        baseErrorRate += Math.random() * 3 + 1
        baseRespP95 += Math.random() * 300 + 200
      }
    } else if (scenario === "app") {
      if (i <= 15) {
        baseSuccessRate -= Math.random() * 10 + 5
        baseErrorRate += Math.random() * 8 + 5
        baseRespP95 += Math.random() * 500 + 300
        baseReq *= 0.7 + Math.random() * 0.2
      }
    } else if (scenario === "crossborder") {
      if (i <= 25) {
        baseRtt += Math.sin(i * 0.5) * 150 + 100
        baseLoss += Math.abs(Math.sin(i * 0.3)) * 1.5
        baseRetrans += Math.abs(Math.cos(i * 0.4)) * 3
      }
    } else if (scenario === "retrans") {
      if (i <= 18) {
        baseRetrans += Math.random() * 15 + 10
        baseInMbps += Math.random() * 100 + 50
        baseOutMbps += Math.random() * 80 + 40
        baseRtt += Math.random() * 100 + 50
      }
    }

    // Add some noise
    const noise = () => (Math.random() - 0.5) * 0.1

    data.push({
      ts,
      time,
      rtt: +Math.max(10, baseRtt + baseRtt * noise()).toFixed(2),
      loss: +Math.max(0, baseLoss + baseLoss * noise()).toFixed(2),
      retrans: +Math.max(0, baseRetrans + baseRetrans * noise()).toFixed(2),
      conn: Math.round(Math.max(100, baseConn + baseConn * noise())),
      inMbps: +Math.max(10, baseInMbps + baseInMbps * noise()).toFixed(2),
      outMbps: +Math.max(10, baseOutMbps + baseOutMbps * noise()).toFixed(2),
      req: Math.round(Math.max(50, baseReq + baseReq * noise())),
      successRate: +Math.min(100, Math.max(0, baseSuccessRate + baseSuccessRate * noise() * 0.1)).toFixed(2),
      respP95: +Math.max(50, baseRespP95 + baseRespP95 * noise()).toFixed(2),
      errorRate: +Math.max(0, baseErrorRate + baseErrorRate * noise()).toFixed(2),
      codeSuccess: +Math.max(0, 100 - baseErrorRate - 0.1).toFixed(2),
      code4xx: +(0.1 + Math.random() * 0.1).toFixed(2),
      code5xx: +(baseErrorRate * 0.7).toFixed(2),
      codeTimeout: +(baseErrorRate * 0.3).toFixed(2),
    })
  }

  return data
}

function calcNHI(points: any[]) {
  if (!points.length) return 0
  const avgRtt = points.reduce((sum, p) => sum + p.rtt, 0) / points.length
  const avgLoss = points.reduce((sum, p) => sum + p.loss, 0) / points.length
  const avgRetrans = points.reduce((sum, p) => sum + p.retrans, 0) / points.length

  const rttScore = Math.max(0, 100 - (avgRtt - 100) * 0.5)
  const lossScore = Math.max(0, 100 - avgLoss * 20)
  const retransScore = Math.max(0, 100 - avgRetrans * 10)

  return +((rttScore + lossScore + retransScore) / 3).toFixed(2)
}

function calcTHI(points: any[]) {
  if (!points.length) return 0
  const avgSuccessRate = points.reduce((sum, p) => sum + p.successRate, 0) / points.length
  const avgRespP95 = points.reduce((sum, p) => sum + p.respP95, 0) / points.length
  const avgErrorRate = points.reduce((sum, p) => sum + p.errorRate, 0) / points.length

  const successScore = avgSuccessRate
  const respScore = Math.max(0, 100 - (avgRespP95 - 200) * 0.1)
  const errorScore = Math.max(0, 100 - avgErrorRate * 10)

  return +((successScore + respScore + errorScore) / 3).toFixed(2)
}

function healthColor(value: number) {
  if (value >= 80) return "green"
  if (value >= 60) return "orange"
  return "red"
}

function zscore(values: number[], target: number) {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  const stddev = Math.sqrt(variance)
  return stddev === 0 ? 0 : (target - mean) / stddev
}

function attributionBadge(nhi: number, thi: number, points: any[], t: (k: string) => string) {
  const last = points.at(-1)
  const window = points.slice(-15)
  const nhiPrev = calcNHI(window.slice(0, -3))
  const thiPrev = calcTHI(window.slice(0, -3))
  const nhiDrop = nhiPrev - nhi
  const thiDrop = thiPrev - thi

  const reqFlat = Math.abs(zscore(window.map((p) => p.req), last.req)) < 0.6
  const bitrateUp = zscore(window.map((p) => p.inMbps + p.outMbps), last.inMbps + last.outMbps) > 1.0

  if (bitrateUp && reqFlat && zscore(window.map((p) => p.retrans), last.retrans) > 1.2) {
    return { text: t("badge_retrans"), color: "purple" }
  }

  if (nhiDrop > 15 && thiDrop > 10) {
    return { text: t("badge_network"), color: "red" }
  }
  if (thiDrop > 15 && nhiDrop < 5) {
    return { text: t("badge_app"), color: "orange" }
  }
  if (nhiDrop > 10 && Math.abs(zscore(window.map((p) => p.rtt), last.rtt)) > 1.5) {
    return { text: t("badge_crossborder"), color: "blue" }
  }

  return null
}

function avg(points: any[], valueKey: string, weightKey: string) {
  let wsum = 0, vsum = 0
  for (const p of points) {
    const w = Math.max(0.0001, p[weightKey])
    wsum += w
    vsum += p[valueKey] * w
  }
  return +(vsum / wsum).toFixed(2)
}

interface VisaPreviewProps {
  className?: string
  hideHeader?: boolean
  timeRange?: string
  isSimulatedData?: boolean
  scenario?: string
}

export default function VisaPreview({
  className = "",
  hideHeader = false,
  timeRange: externalTimeRange,
  isSimulatedData: externalIsSimulatedData,
  scenario: externalScenario
}: VisaPreviewProps) {
  const { locale, setLocale, t, nfmt, tfmt, isClient } = useI18n("en-US")
  const [internalTimeRange, setInternalTimeRange] = useState("15m")
  const [internalScenario, setInternalScenario] = useState("normal")
  const [internalIsSimulatedData, setInternalIsSimulatedData] = useState(false)

  // Use external props if provided, otherwise use internal state
  const timeRange = externalTimeRange ?? internalTimeRange
  const scenario = externalScenario ?? internalScenario
  const isSimulatedData = externalIsSimulatedData ?? internalIsSimulatedData
  const setTimeRange = externalTimeRange ? () => {} : setInternalTimeRange
  const setScenario = externalScenario ? () => {} : setInternalScenario
  const setIsSimulatedData = externalIsSimulatedData !== undefined ? () => {} : setInternalIsSimulatedData

  const minutes = timeRange === "5m" ? 5 : timeRange === "15m" ? 15 : timeRange === "1h" ? 60 : 240

  const data = useMemo(() => {
    if (!isClient) {
      return Array.from({ length: minutes + 1 }, (_, i) => ({
        ts: Date.now() - i * 60 * 1000,
        time: "00:00",
        rtt: 120,
        loss: 0.1,
        retrans: 1.0,
        conn: 800,
        inMbps: 180,
        outMbps: 120,
        req: 300,
        successRate: 99.7,
        respP95: 350,
        errorRate: 0.2,
        codeSuccess: 99.8,
        code4xx: 0.1,
        code5xx: 0.08,
        codeTimeout: 0.02,
      }))
    }
    const effectiveScenario = isSimulatedData ? scenario : "normal"
    return genSeries({ minutes, scenario: effectiveScenario, tfmt })
  }, [minutes, scenario, isSimulatedData, tfmt, isClient])

  const windowPoints = data
  const nhi = useMemo(() => calcNHI(windowPoints), [windowPoints])
  const thi = useMemo(() => calcTHI(windowPoints), [windowPoints])
  const badge = useMemo(() => attributionBadge(nhi, thi, windowPoints, t), [nhi, thi, windowPoints, t])
  const kpi = windowPoints.at(-1)

  return (
    <div className={`flex flex-col h-full bg-background ${className}`}>
      {!hideHeader && (
        <>
          {/* Header Controls */}
          <div className="sticky top-0 z-10 p-4 border-b border-border bg-card">
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
                        setIsSimulatedData(checked)
                        if (!checked) {
                          setScenario("normal")
                        } else {
                          // Set default to "network" when switching to simulated data
                          setScenario("network")
                        }
                      }}
                    />
                    <span className="text-sm text-muted-foreground">{t("simulatedData")}</span>
                  </div>

                  {isSimulatedData && (
                    <Select value={scenario} onValueChange={setScenario}>
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
                <Select value={timeRange} onValueChange={setTimeRange}>
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
        </>
      )}

      {/* Dashboard Content - Added overflow-y-auto for proper scrolling */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Executive Summary - Health Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 corner-sm p-6 border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">VISA Service Health Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overall Status - Minimal Modern Design */}
              <div className={`corner-sm p-6 text-center transition-all duration-200 ${
                Math.min(nhi, thi) >= 80 ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800" :
                Math.min(nhi, thi) >= 60 ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800" :
                "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
              }`}>
                <div className={`w-16 h-16 mx-auto mb-4 corner-full flex items-center justify-center ${
                  Math.min(nhi, thi) >= 80 ? "bg-emerald-100 dark:bg-emerald-900/50" :
                  Math.min(nhi, thi) >= 60 ? "bg-amber-100 dark:bg-amber-900/50" :
                  "bg-red-100 dark:bg-red-900/50"
                }`}>
                  <svg className={`w-8 h-8 ${
                    Math.min(nhi, thi) >= 80 ? "text-emerald-600 dark:text-emerald-400" :
                    Math.min(nhi, thi) >= 60 ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {Math.min(nhi, thi) >= 80 ?
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> :
                      Math.min(nhi, thi) >= 60 ?
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /> :
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    }
                  </svg>
                </div>
                <div className={`text-xl font-semibold mb-2 ${
                  Math.min(nhi, thi) >= 80 ? "text-emerald-700 dark:text-emerald-300" :
                  Math.min(nhi, thi) >= 60 ? "text-amber-700 dark:text-amber-300" :
                  "text-red-700 dark:text-red-300"
                }`}>
                  {Math.min(nhi, thi) >= 80 ? "Healthy" : Math.min(nhi, thi) >= 60 ? "Warning" : "Critical"}
                </div>
                <div className="text-sm text-muted-foreground">Overall Status</div>
              </div>

              {/* Network Health */}
              <Card className="border-2 border-blue-200 dark:border-blue-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Network Health</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">
                      {nfmt(nhi, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Progress value={nhi} className="h-2 mb-2" />
                  <span className={`text-xs font-medium px-2 py-1 corner-xs ${
                    healthColor(nhi) === "green" ? "bg-emerald-100 text-emerald-700" :
                    healthColor(nhi) === "orange" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {healthColor(nhi) === "green" ? "Healthy" :
                     healthColor(nhi) === "orange" ? "Warning" : "Critical"}
                  </span>
                </CardContent>
              </Card>

              {/* Transaction Health */}
              <Card className="border-2 border-green-200 dark:border-green-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Transaction Health</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">
                      {nfmt(thi, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Progress value={thi} className="h-2 mb-2" />
                  <span className={`text-xs font-medium px-2 py-1 corner-xs ${
                    healthColor(thi) === "green" ? "bg-emerald-100 text-emerald-700" :
                    healthColor(thi) === "orange" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {healthColor(thi) === "green" ? "Healthy" :
                     healthColor(thi) === "orange" ? "Warning" : "Critical"}
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Layer 1: Transaction Processing Health */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 corner-sm p-6 border border-green-200 dark:border-green-800">
            <h2 className="text-xl font-semibold mb-4 text-green-900 dark:text-green-100 flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Layer 1: Transaction Processing Health
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transaction KPIs */}
              <Card className="border-green-200 dark:border-green-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Core Transaction Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{nfmt(kpi?.req || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="text-sm text-muted-foreground">Requests/sec</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{kpi?.successRate.toFixed(2) || "0.00"}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{kpi?.respP95.toFixed(2) || "0.00"}ms</div>
                      <div className="text-sm text-muted-foreground">Response P95</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{kpi?.errorRate.toFixed(2) || "0.00"}%</div>
                      <div className="text-sm text-muted-foreground">Error Rate</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    💡 High request count + low success rate → service issue (logic/dependency)
                  </div>
                </CardContent>
              </Card>

              {/* Response Code Distribution */}
              <Card className="border-green-200 dark:border-green-700">
                <CardHeader>
                  <CardTitle className="text-lg">Response Code Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    {isClient ? (
                      <ResponsiveContainer>
                        <BarChart data={windowPoints.slice(-10)} syncId="main">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" interval="preserveStartEnd"/>
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="codeSuccess" stackId="codes" name={t("success")} fill="#10b981" />
                          <Bar dataKey="code4xx" stackId="codes" name={t("fourxx")} fill="#f59e0b" />
                          <Bar dataKey="code5xx" stackId="codes" name={t("fivexx")} fill="#ef4444" />
                          <Bar dataKey="codeTimeout" stackId="codes" name={t("timeout")} fill="#6366f1" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    💡 Many 5xx errors + response time surge → VISA system slowdown
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Layer 2: Network Transmission Health */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 corner-sm p-6 border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Wifi className="h-6 w-6" />
              Layer 2: Network Transmission Health
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="border-blue-200 dark:border-blue-700">
                <CardHeader>
                  <CardTitle className="text-lg">
                    End-to-End Latency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    {isClient ? (
                      <ResponsiveContainer>
                        <ComposedChart data={windowPoints} syncId="main">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" interval="preserveStartEnd"/>
                          <YAxis yAxisId="left" orientation="left" />
                          <Tooltip />
                          <Line yAxisId="left" type="monotone" dataKey="rtt" stroke="#6366f1" name="P95 RTT" dot={false} strokeWidth={2} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    💡 Normal average but high P99 → some transactions timing out
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-700">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Packet Loss & Retransmission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    {isClient ? (
                      <ResponsiveContainer>
                        <ComposedChart data={windowPoints} syncId="main">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" interval="preserveStartEnd"/>
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Line yAxisId="left" type="monotone" dataKey="loss" stroke="#f59e0b" name="Loss %" dot={false} />
                          <Line yAxisId="right" type="monotone" dataKey="retrans" stroke="#ef4444" name="Retrans %" dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    💡 High packet loss/retransmission + transaction failure → network issue
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-700">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Traffic & Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    {isClient ? (
                      <ResponsiveContainer>
                        <ComposedChart data={windowPoints} syncId="main">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" interval="preserveStartEnd"/>
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Area yAxisId="left" type="monotone" dataKey="inMbps" stackId="1" name="Ingress Mbps" fill="#bfdbfe" stroke="#60a5fa" />
                          <Area yAxisId="left" type="monotone" dataKey="outMbps" stackId="1" name="Egress Mbps" fill="#c7d2fe" stroke="#818cf8" />
                          <Line yAxisId="right" type="monotone" dataKey="conn" name="Concurrent" stroke="#10b981" dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    💡 Connection spike but transactions drop → possible traffic surge or DDoS
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Layer 3: Cross-Layer Correlation Diagnostics */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 corner-sm p-6 border border-purple-200 dark:border-purple-800">
            <h2 className="text-xl font-semibold mb-4 text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Layer 3: Cross-Layer Correlation Diagnostics
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Success Rate vs Network Latency */}
              <Card className="border-purple-200 dark:border-purple-700">
                <CardHeader>
                  <CardTitle className="text-lg">Success Rate vs Network Latency</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Dual-axis correlation to identify root cause
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    {isClient ? (
                      <ResponsiveContainer>
                        <ComposedChart data={windowPoints} syncId="main">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" interval="preserveStartEnd"/>
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Line yAxisId="left" type="monotone" dataKey="successRate" stroke="#10b981" name="Success %" dot={false} strokeWidth={2} />
                          <Line yAxisId="right" type="monotone" dataKey="rtt" stroke="#6366f1" name="P95 RTT" dot={false} strokeWidth={2} />
                          <ReferenceLine yAxisId="left" y={99.5} stroke="#0ea5e9" strokeDasharray="4 4" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    💡 Success rate drops + latency rises → network bottleneck<br/>
                    💡 Success rate drops + latency normal → VISA internal issue
                  </div>
                </CardContent>
              </Card>

              {/* Packet Loss vs Response Time Bubble Chart */}
              <Card className="border-purple-200 dark:border-purple-700">
                <CardHeader>
                  <CardTitle className="text-lg">Packet Loss vs Response Time</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Bubble size represents retransmission rate
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    {isClient ? (
                      <ResponsiveContainer>
                        <ScatterChart syncId="main">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" dataKey="loss" name="Loss %" domain={[0, 'dataMax + 0.5']} />
                          <YAxis type="number" dataKey="respP95" name="P95 (ms)" />
                          <ZAxis type="number" dataKey="retrans" range={[60, 200]} name="Retrans % (bubble)" />
                          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                          <Scatter name="Correlation Points" data={windowPoints} fill="#ef4444" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    💡 Large bubbles in upper right → network congestion causing both packet loss and delays
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Diagnosis Panel */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-950/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Network Issue Pattern</h3>
                  <div className="text-sm text-red-700 dark:text-red-300">
                    • Transaction failure rate ↑<br/>
                    • Packet loss/retransmission ↑<br/>
                    • Network latency ↑<br/>
                    → Check network infrastructure
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Application Issue Pattern</h3>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    • Transaction failure rate ↑<br/>
                    • Network metrics normal<br/>
                    • Many 5xx errors<br/>
                    → Check VISA application layer
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Cross-border Issue Pattern</h3>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    • Transaction volume drops<br/>
                    • Packet loss rises<br/>
                    • Latency oscillates<br/>
                    → Check external routing
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Response Time Distribution by Code */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Response Time Distribution by Return Code
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Weighted average response times help identify which error types cause delays
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  {isClient ? (
                    <ResponsiveContainer>
                      <ComposedChart data={[
                        { name: t("success"), avg: avg(windowPoints, 'respP95', 'codeSuccess') },
                        { name: t("fourxx"), avg: avg(windowPoints, 'respP95', 'code4xx') },
                        { name: t("fivexx"), avg: avg(windowPoints, 'respP95', 'code5xx') },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avg" name="Weighted Average Response Time (ms)" fill="#6366f1" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-muted-foreground">Loading chart...</div>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  💡 Higher response times for error codes (4xx/5xx) may indicate application processing issues
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pb-10 text-xs text-muted-foreground text-center">{t("footer")}</div>
        </div>
      </div>
    </div>
  )
}
