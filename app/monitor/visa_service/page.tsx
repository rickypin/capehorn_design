"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Send,
  Bot,
  User,
  Activity,
  Wifi,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Clock,
  Network,
  Globe,
  CreditCard,
  Menu,
  ChevronLeft,
  ChevronRight,
  Shield,
  Monitor as MonitorIcon,
  Home,
  Maximize2,
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
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface MetricData {
  name: string
  value: number
  unit: string
  status: "normal" | "warning" | "critical"
  icon: React.ReactNode
  trend: "up" | "down" | "stable"
}

interface AlertData {
  id: string
  message: string
  level: "info" | "warning" | "error"
  time: string
  resolved: boolean
}

// i18n Dictionary for VISA Dashboard
const DICT = {
  "zh-CN": {
    title: "VISA Service",
    timeRange: "时间窗",
    scenario: "场景",
    scenario_normal: "场景：正常",
    scenario_network: "场景：网络异常",
    scenario_app: "场景：应用异常",
    scenario_crossborder: "场景：跨境路由抖动",
    scenario_retrans: "场景：重传风暴",
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
    corr_read_1: "读法：成功率下行且 RTT 上行 → 网络疑似；成功率下行且 RTT 平稳 → 应用/依赖疑似。",
    corr_title_2: "响应时间 P95 vs 丢包率（散点诊断）",
    corr_read_2: "读法：右上象限为网络传输瓶颈；气泡越大表示重传率越高。",
    bar_title: "返回码 × 响应时间（简化箱线-均值图）",
    bar_hint: "用于判断 5xx/超时类型",
    weighted_avg: "加权均值 P95 (ms)",
    footer: "单页原型，仅演示交互逻辑与组合读法。指标阈值、权重可在真实环境中调整。",
    badge_net: "网络疑似",
    badge_app: "应用/依赖疑似",
    badge_cross: "疑似跨境路由抖动",
    badge_retrans: "疑似异常流量/重传风暴",
    r5: "5 分钟",
    r15: "15 分钟",
    r60: "1 小时",
    r1440: "24 小时",
  },
  "en-US": {
    title: "VISA Service",
    timeRange: "Time Range",
    scenario: "Scenario",
    scenario_normal: "Scenario: Normal",
    scenario_network: "Scenario: Network Incident",
    scenario_app: "Scenario: App/Dependency Incident",
    scenario_crossborder: "Scenario: Cross-border Jitter",
    scenario_retrans: "Scenario: Retransmission Storm",
    nhi: "NHI Network Impact",
    thi: "THI Transaction Health",
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
    corr_read_1: "Guide: Success ↓ with RTT ↑ ⇒ likely Network; Success ↓ with stable RTT ⇒ likely App/Dependency.",
    corr_title_2: "Response P95 vs Packet Loss (Scatter)",
    corr_read_2: "Guide: Top-right quadrant indicates network transport bottleneck; larger bubbles = higher retransmission.",
    bar_title: "Resp Codes × Response (Weighted Mean)",
    bar_hint: "Helps distinguish 5xx vs timeout",
    weighted_avg: "Weighted Mean P95 (ms)",
    footer: "Prototype only. Thresholds/weights are adjustable in real environments.",
    badge_net: "Likely Network",
    badge_app: "Likely App/Dependency",
    badge_cross: "Likely Cross-border Routing Jitter",
    badge_retrans: "Suspected Abnormal Traffic/ Retrans Storm",
    r5: "5 min",
    r15: "15 min",
    r60: "1 h",
    r1440: "24 h",
  },
}

function useI18n(initial = "en-US") {
  const [locale, setLocale] = useState(initial)
  const dict = DICT[locale as keyof typeof DICT] || DICT["en-US"]
  const t = (k: string) => dict[k as keyof typeof dict] ?? k
  const nfmt = (v: number, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, opts).format(v)
  const tfmt = (ts: number) => new Date(ts).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
  return { locale, setLocale, t, nfmt, tfmt }
}

function genSeries({ minutes = 60, scenario = "normal", tfmt }: { minutes: number; scenario: string; tfmt: (ts: number) => string }) {
  const now = Date.now()
  const points = []
  let baseRtt = 120 // ms P95
  let baseLoss = 0.1 // %
  let baseRetrans = 1.0 // %
  let baseConn = 800
  let baseIn = 180 // Mbps
  let baseOut = 120 // Mbps
  let baseReq = 300 // rps
  let baseSucc = 99.7 // %
  let baseResp = 350 // ms P95
  let baseErr = 0.2 // % (5xx+timeout)

  // Simple deterministic pseudo-random function for consistent SSR/client rendering
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  for (let i = minutes; i >= 0; i--) {
    const ts = now - i * 60 * 1000
    const pulse = Math.sin((i / 10) * Math.PI) * 0.5 + seededRandom(i + ts) * 0.2

    // Baseline fluctuation
    let rtt = baseRtt * (1 + 0.05 * pulse)
    let loss = baseLoss * (1 + 0.5 * Math.max(0, pulse))
    let retrans = baseRetrans * (1 + 0.4 * Math.max(0, pulse))
    let conn = baseConn * (1 + 0.1 * pulse)
    let inMbps = baseIn * (1 + 0.2 * pulse)
    let outMbps = baseOut * (1 + 0.2 * pulse)

    let req = baseReq * (1 + 0.15 * pulse)
    let succ = baseSucc - 0.05 * Math.max(0, pulse)
    let resp = baseResp * (1 + 0.08 * pulse)
    let err = baseErr * (1 + 0.3 * Math.max(0, pulse))

    // Scenario injection anomalies
    if (scenario === "network") {
      if (i < 20 && i > 8) {
        rtt *= 1.6 // Latency increase
        loss += 0.6 // Percentage points
        retrans *= 2.5
        resp *= 1.4
        succ -= 1.0 // Success rate decline
        err *= 3.0
      }
    }

    if (scenario === "app") {
      if (i < 20 && i > 8) {
        resp *= 1.6
        succ -= 1.5
        err *= 4.0
        // Network remains stable
      }
    }

    if (scenario === "crossborder") {
      if (i < 30 && i > 12) {
        rtt *= 1.8
        loss += 0.4
        retrans *= 1.8
        succ -= 0.6
        // Bitrate changes minimal
      }
    }

    if (scenario === "retransStorm") {
      if (i < 25 && i > 5) {
        outMbps *= 1.8
        inMbps *= 2.0
        conn *= 1.6
        retrans *= 3.5
        // Request count remains stable
        succ -= 0.7
        resp *= 1.2
      }
    }

    // Response code distribution (based on success rate/error rate)
    const successRate = Math.max(95, Math.min(100, succ))
    const errorRate = Math.max(0.05, err) // %
    const timeoutRate = Math.max(0, scenario === "network" || scenario === "crossborder" ? errorRate * 0.4 : errorRate * 0.2)
    const fiveXXRate = Math.max(0, scenario === "app" ? errorRate * 0.6 : errorRate * 0.4)
    const fourXXRate = Math.max(0, errorRate - timeoutRate - fiveXXRate)

    points.push({
      ts,
      time: tfmt(ts),
      rtt: +rtt.toFixed(1),
      loss: +loss.toFixed(2),
      retrans: +retrans.toFixed(2),
      conn: Math.round(conn),
      inMbps: +inMbps.toFixed(1),
      outMbps: +outMbps.toFixed(1),
      req: Math.round(req),
      successRate: +successRate.toFixed(2),
      respP95: +resp.toFixed(1),
      errorRate: +errorRate.toFixed(2),
      codeSuccess: +(100 - errorRate).toFixed(2),
      code4xx: +fourXXRate.toFixed(2),
      code5xx: +fiveXXRate.toFixed(2),
      codeTimeout: +timeoutRate.toFixed(2),
    })
  }
  return points
}

function zscore(values: number[], v: number) {
  const n = values.length
  const mean = values.reduce((a, b) => a + b, 0) / n
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n
  const std = Math.sqrt(variance) || 1
  return (v - mean) / std
}

function calcNHI(windowPoints: any[]) {
  if (!windowPoints.length) return 100
  const rttZ = zscore(windowPoints.map((p) => p.rtt), windowPoints.at(-1).rtt)
  const lossZ = zscore(windowPoints.map((p) => p.loss), windowPoints.at(-1).loss)
  const retransZ = zscore(windowPoints.map((p) => p.retrans), windowPoints.at(-1).retrans)
  const connZ = zscore(windowPoints.map((p) => p.conn), windowPoints.at(-1).conn)
  const w1 = 0.35, w2 = 0.3, w3 = 0.2, w4 = 0.15
  const raw = w1 * Math.max(0, rttZ) + w2 * Math.max(0, lossZ) + w3 * Math.max(0, retransZ) + w4 * Math.max(0, connZ)
  return Math.max(0, Math.min(100, 100 - 18 * raw))
}

function calcTHI(windowPoints: any[]) {
  if (!windowPoints.length) return 100
  const oneMinusSucc = 100 - windowPoints.at(-1).successRate // Lower is better
  const p95 = windowPoints.at(-1).respP95
  const err = windowPoints.at(-1).errorRate
  const sZ = zscore(windowPoints.map((p) => 100 - p.successRate), oneMinusSucc)
  const pZ = zscore(windowPoints.map((p) => p.respP95), p95)
  const eZ = zscore(windowPoints.map((p) => p.errorRate), err)
  const a1 = 0.45, a2 = 0.35, a3 = 0.2
  const raw = a1 * Math.max(0, sZ) + a2 * Math.max(0, pZ) + a3 * Math.max(0, eZ)
  return Math.max(0, Math.min(100, 100 - 20 * raw))
}

function healthColor(v: number): "green" | "orange" | "red" {
  if (v >= 80) return "green"
  if (v >= 60) return "orange"
  return "red"
}

function attributionBadge(nhi: number, thi: number, points: any[], t: (k: string) => string) {
  const last = points.at(-1)
  const window = points.slice(-15) // Last 15 points for comparison
  const nhiPrev = calcNHI(window.slice(0, -3))
  const thiPrev = calcTHI(window.slice(0, -3))
  const nhiDrop = nhiPrev - nhi
  const thiDrop = thiPrev - thi

  // Additional rules based on curve patterns
  const reqFlat = Math.abs(zscore(window.map((p) => p.req), last.req)) < 0.6
  const bitrateUp = zscore(window.map((p) => p.inMbps + p.outMbps), last.inMbps + last.outMbps) > 1.0

  if (bitrateUp && reqFlat && zscore(window.map((p) => p.retrans), last.retrans) > 1.2) {
    return { text: t("badge_retrans"), color: "purple" }
  }

  if (thiDrop > 8 && nhiDrop > 10) return { text: t("badge_net"), color: "red" }
  if (thiDrop > 8 && Math.abs(nhiDrop) <= 5) return { text: t("badge_app"), color: "orange" }

  // Cross-border: latency step + slight packet loss increase
  const rttJump = zscore(window.map((p) => p.rtt), last.rtt) > 1.2
  const lossSlight = zscore(window.map((p) => p.loss), last.loss) > 0.6
  if (rttJump && lossSlight && thiDrop > 3) return { text: t("badge_cross"), color: "blue" }

  // Return null instead of "Needs Investigation" to remove the badge
  return null
}



function avg(points: any[], valueKey: string, weightKey: string) {
  let wsum = 0, vsum = 0
  for (const p of points) {
    const w = Math.max(0.0001, p[weightKey])
    wsum += w
    vsum += p[valueKey] * w
  }
  return +(vsum / wsum).toFixed(1)
}

export default function VisaServicePage() {
  const router = useRouter()
  const { locale, setLocale, t, nfmt, tfmt } = useI18n("en-US")
  const [currentDateTime, setCurrentDateTime] = useState("")

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI Network Monitoring Assistant. I can help you monitor system performance, analyze network metrics, handle alerts, and optimize your infrastructure. What can I help you with today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [timeRange, setTimeRange] = useState("15m")
  const [scenario, setScenario] = useState("network") // normal | network | app | crossborder | retransStorm
  const [isClient, setIsClient] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeNavItem, setActiveNavItem] = useState("Monitor")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fix hydration mismatch by ensuring client-side only data generation
  useEffect(() => {
    setIsClient(true)
    // Set current date and time for breadcrumb
    const now = new Date()
    const formattedDateTime = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '')
    setCurrentDateTime(formattedDateTime)
  }, [])

  const minutes = timeRange === "5m" ? 5 : timeRange === "15m" ? 15 : timeRange === "1h" ? 60 : 240

  const data = useMemo(() => {
    if (!isClient) {
      // Return static data for SSR to prevent hydration mismatch
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
    return genSeries({ minutes, scenario, tfmt })
  }, [minutes, scenario, tfmt, isClient])

  const windowPoints = data // In this prototype, timeRange is the window
  const nhi = useMemo(() => calcNHI(windowPoints), [windowPoints])
  const thi = useMemo(() => calcTHI(windowPoints), [windowPoints])
  const badge = useMemo(() => attributionBadge(nhi, thi, windowPoints, t), [nhi, thi, windowPoints, t])



  // KPI
  const kpi = windowPoints.at(-1)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")

    setTimeout(() => {
      const response = generateAIResponse(currentInput)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }, 1200)
  }

  const generateAIResponse = (input: string): { message: string; action?: string } => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("optimize") || lowerInput.includes("improve") || lowerInput.includes("performance")) {
      return {
        message:
          "Initiating VISA network optimization... Analyzing transaction patterns, reducing P95 latency, optimizing TCP connections across regions. Monitoring real-time improvements across all metrics.",
        action: "optimize",
      }
    }

    if (lowerInput.includes("network") || lowerInput.includes("latency") || lowerInput.includes("tcp")) {
      return {
        message: `VISA Network Analysis: NHI (Network Health Index): ${nhi.toFixed(0)}%, THI (Transaction Health Index): ${thi.toFixed(0)}%. Current P95 latency: ${kpi?.rtt || 0}ms, Packet loss: ${kpi?.loss || 0}%.`,
      }
    }

    if (lowerInput.includes("status") || lowerInput.includes("monitor") || lowerInput.includes("health")) {
      return {
        message: `VISA Service Status: Request rate: ${kpi?.req || 0} rps, Success rate: ${kpi?.successRate?.toFixed(2) || 0}%, P95 response time: ${kpi?.respP95?.toFixed(0) || 0}ms, Error rate: ${kpi?.errorRate?.toFixed(2) || 0}%. Attribution: ${badge?.text || "Normal"}`,
      }
    }

    return {
      message:
        "I'm monitoring VISA network and transaction performance in real-time. I can help with cross-border latency analysis, TCP optimization, payment transaction monitoring, and regional performance tuning. What would you like to focus on?",
    }
  }

  return (
    <>
    <div className="flex h-screen bg-background">
      {/* Left Navigation Sidebar - Highest Level */}
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

      {/* Right Content Area - Chat + Dashboard */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar with Breadcrumb - Updated for correct hierarchy */}
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
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-foreground font-medium hover:bg-muted"
                onClick={() => router.push("/monitor")}
              >
                Monitor
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground font-medium">
                VISA Service
              </span>
            </nav>
          </div>
        </div>

        {/* Content Area Below Breadcrumb */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Sidebar - Reduced to 1/5 width */}
          <div className="w-72 flex flex-col border-r border-border bg-sidebar">
        {/* Chat header */}
        <div className="p-4 border-b border-sidebar-border bg-card">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-sidebar-foreground">AI Network Monitor</h1>
              <p className="text-sm text-muted-foreground">Performance Assistant</p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.sender === "user" ? "justify-end" : ""}`}>
              {message.sender === "ai" && (
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[85%] ${message.sender === "user" ? "order-first" : ""}`}>
                <Card
                  className={`${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-card"} shadow-sm`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about network performance..."
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 text-sm"
            />
            <Button onClick={handleSendMessage} size="sm" className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard - Expanded to 4/5 width */}
      <div className="flex-1 bg-background flex flex-col">
        {/* Dashboard Preview Header */}
        <div className="sticky top-0 z-20 bg-card border-b border-border">
          <div className="px-6 py-3 flex items-center justify-between">
            <span className="text-lg font-medium text-foreground">Preview</span>
            <div className="flex items-center gap-2">
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger className="w-48 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">{t("scenario_normal")}</SelectItem>
                  <SelectItem value="network">{t("scenario_network")}</SelectItem>
                  <SelectItem value="app">{t("scenario_app")}</SelectItem>
                  <SelectItem value="crossborder">{t("scenario_crossborder")}</SelectItem>
                  <SelectItem value="retransStorm">{t("scenario_retrans")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locale} onValueChange={setLocale}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-CN">中文</SelectItem>
                  <SelectItem value="en-US">English</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  // Toggle fullscreen functionality can be added here
                  console.log("Fullscreen toggle");
                }}
              >
                <Maximize2 className="h-4 w-4" />
                Fullscreen
              </Button>
            </div>
          </div>
        </div>

        {/* VISA Dashboard Header */}
        <div className="sticky top-0 z-10">
          <div className="px-6 py-3 flex flex-wrap items-center gap-3">
            {/* Left side: Service and filters */}
            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                {t("title")}
              </span>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">{t("r5")}</SelectItem>
                  <SelectItem value="15m">{t("r15")}</SelectItem>
                  <SelectItem value="1h">{t("r60")}</SelectItem>
                  <SelectItem value="24h">{t("r1440")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right side: Attribution badge (only if not null) */}
            <div className="ml-auto flex items-center gap-4">
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

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {/* Health Indices Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    {t("nhi")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-foreground">
                        {nfmt(nhi, { maximumFractionDigits: 0 })}
                      </span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        healthColor(nhi) === "green" ? "bg-emerald-100 text-emerald-700" :
                        healthColor(nhi) === "orange" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {healthColor(nhi) === "green" ? "Healthy" :
                         healthColor(nhi) === "orange" ? "Warning" : "Critical"}
                      </span>
                    </div>
                    <Progress value={nhi} color={healthColor(nhi)} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Network Health Index based on latency, packet loss, and retransmission metrics
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {t("thi")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-foreground">
                        {nfmt(thi, { maximumFractionDigits: 0 })}
                      </span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        healthColor(thi) === "green" ? "bg-emerald-100 text-emerald-700" :
                        healthColor(thi) === "orange" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {healthColor(thi) === "green" ? "Healthy" :
                         healthColor(thi) === "orange" ? "Warning" : "Critical"}
                      </span>
                    </div>
                    <Progress value={thi} color={healthColor(thi)} className="h-3" />
                    <p className="text-sm text-muted-foreground">
                      Transaction Health Index based on success rate, response time, and error rate
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Network Health Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {t("card_latency")}
                  </CardTitle>

                </CardHeader>
                <CardContent>
                  <div className="h-56">
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-primary" />
                    {t("card_loss_retrans")}
                  </CardTitle>

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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-primary" />
                    {t("card_bitrate_conn")}
                  </CardTitle>

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
                </CardContent>
              </Card>
            </div>

            {/* Transaction Validation Section */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    {t("kpi_title")}
                  </CardTitle>

                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t("req")}</div>
                      <div className="text-2xl font-semibold">{nfmt(kpi?.req || 0)}</div>
                      <div className="text-xs text-muted-foreground">{t("latest")}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t("succRate")}</div>
                      <div className="text-2xl font-semibold">{kpi?.successRate.toFixed(2) || "0.00"}</div>
                      <div className="text-xs text-muted-foreground">{t("latest")}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t("respP95")}</div>
                      <div className="text-2xl font-semibold">{kpi?.respP95.toFixed(0) || "0"}</div>
                      <div className="text-xs text-muted-foreground">{t("latest")}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">{t("errRate")}</div>
                      <div className="text-2xl font-semibold">{kpi?.errorRate.toFixed(2) || "0.00"}</div>
                      <div className="text-xs text-muted-foreground">{t("latest")}</div>
                    </div>
                  </div>

                  <div className="h-56 mt-4">
                    {isClient ? (
                      <ResponsiveContainer>
                        <BarChart data={windowPoints} syncId="main">
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
                </CardContent>
              </Card>
            </div>

            {/* Correlation Diagnostics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("corr_title_1")}</CardTitle>
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
                          <Line yAxisId="left" type="monotone" dataKey="successRate" stroke="#10b981" name="Success %" dot={false} />
                          <Line yAxisId="right" type="monotone" dataKey="rtt" stroke="#6366f1" name="P95 RTT" dot={false} />
                          <ReferenceLine yAxisId="left" y={99.5} stroke="#0ea5e9" strokeDasharray="4 4" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">{t("corr_read_1")}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("corr_title_2")}</CardTitle>
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
                          <Scatter name="t" data={windowPoints} fill="#ef4444" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">{t("corr_read_2")}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("bar_title")}</CardTitle>

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
                          <Bar dataKey="avg" name={t("weighted_avg")} fill="#6366f1" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">{t("footer")}</div>
                </CardContent>
              </Card>
            </div>

            <div className="pb-10 text-xs text-muted-foreground text-center">{t("footer")}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  </>
  )
}
