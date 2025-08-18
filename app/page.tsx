"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
} from "lucide-react"
import {
  LineChart,
  Line,
  Area,
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

function generateTimeSeriesData(minutes = 60, scenario = "normal") {
  const now = Date.now()
  const points = []
  const baseRtt = 120 // ms P95
  const baseLoss = 0.1 // %
  const baseRetrans = 1.0 // %
  const baseConn = 800
  const baseIn = 180 // Mbps
  const baseOut = 120 // Mbps
  const baseReq = 300 // rps
  const baseSucc = 99.7 // %
  const baseResp = 350 // ms P95
  const baseErr = 0.2 // % (5xx+timeout)

  for (let i = minutes; i >= 0; i--) {
    const ts = now - i * 60 * 1000
    const pulse = Math.sin((i / 10) * Math.PI) * 0.5 + Math.random() * 0.2

    // Base fluctuation
    let rtt = baseRtt * (1 + 0.05 * pulse)
    let loss = baseLoss * (1 + 0.5 * Math.max(0, pulse))
    let retrans = baseRetrans * (1 + 0.4 * Math.max(0, pulse))
    const conn = baseConn * (1 + 0.1 * pulse)
    const inMbps = baseIn * (1 + 0.2 * pulse)
    const outMbps = baseOut * (1 + 0.2 * pulse)

    const req = baseReq * (1 + 0.15 * pulse)
    let succ = baseSucc - 0.05 * Math.max(0, pulse)
    let resp = baseResp * (1 + 0.08 * pulse)
    let err = baseErr * (1 + 0.3 * Math.max(0, pulse))

    // Scenario injection
    if (scenario === "network") {
      if (i < 20 && i > 8) {
        rtt *= 1.6
        loss += 0.6
        retrans *= 2.5
        resp *= 1.4
        succ -= 1.0
        err *= 3.0
      }
    }

    const successRate = Math.max(95, Math.min(100, succ))
    const errorRate = Math.max(0.05, err)
    const timeoutRate = Math.max(0, errorRate * 0.4)
    const fiveXXRate = Math.max(0, errorRate * 0.4)
    const fourXXRate = Math.max(0, errorRate - timeoutRate - fiveXXRate)

    points.push({
      ts,
      time: new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
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

function calculateHealthIndex(windowPoints: any[]) {
  if (!windowPoints.length) return { nhi: 100, thi: 100 }

  const latest = windowPoints[windowPoints.length - 1]
  const rttScore = Math.max(0, 100 - (latest.rtt - 100) * 0.5)
  const lossScore = Math.max(0, 100 - latest.loss * 50)
  const retransScore = Math.max(0, 100 - latest.retrans * 20)

  const nhi = Math.round((rttScore + lossScore + retransScore) / 3)

  const succScore = latest.successRate
  const respScore = Math.max(0, 100 - (latest.respP95 - 300) * 0.2)
  const errScore = Math.max(0, 100 - latest.errorRate * 25)

  const thi = Math.round((succScore + respScore + errScore) / 3)

  return { nhi: Math.max(0, Math.min(100, nhi)), thi: Math.max(0, Math.min(100, thi)) }
}

function getHealthColor(value: number) {
  if (value >= 80) return "emerald"
  if (value >= 60) return "amber"
  return "red"
}

export default function AIAgentInterface() {
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
  const [scenario, setScenario] = useState("normal")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const monitoringData = useMemo(() => {
    const minutes = timeRange === "5m" ? 5 : timeRange === "15m" ? 15 : timeRange === "1h" ? 60 : 240
    return generateTimeSeriesData(minutes, scenario)
  }, [timeRange, scenario])

  const healthIndices = useMemo(() => calculateHealthIndex(monitoringData), [monitoringData])

  const [alerts, setAlerts] = useState<AlertData[]>([
    {
      id: "1",
      message: "Network latency P95 exceeded 150ms threshold",
      level: "warning",
      time: "2 min ago",
      resolved: false,
    },
    {
      id: "2",
      message: "TCP retransmission rate spike detected",
      level: "warning",
      time: "5 min ago",
      resolved: true,
    },
    {
      id: "3",
      message: "System performance optimized successfully",
      level: "info",
      time: "10 min ago",
      resolved: false,
    },
    {
      id: "4",
      message: "Connection pool within normal range",
      level: "info",
      time: "15 min ago",
      resolved: false,
    },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((message) => {
          const change = (Math.random() - 0.5) * 8
          let newValue = message.value + change

          if (message.name === "Request Rate") {
            newValue = Math.max(250, Math.min(400, newValue))
          } else if (message.name === "Response Time P95") {
            newValue = Math.max(80, Math.min(200, newValue))
          } else if (message.name === "Success Rate") {
            newValue = Math.max(98, Math.min(100, newValue))
          } else if (message.name === "Error Rate") {
            newValue = Math.max(0.1, Math.min(1.0, newValue))
          } else if (message.name === "Active Connections") {
            newValue = Math.max(200, Math.min(350, newValue))
          } else {
            newValue = Math.max(0, Math.min(100, newValue))
          }

          const trend = change > 2 ? "up" : change < -2 ? "down" : "stable"

          return {
            ...message,
            value: newValue,
            trend,
            status:
              message.name === "Error Rate"
                ? newValue > 0.5
                  ? "critical"
                  : newValue > 0.3
                    ? "warning"
                    : "normal"
                : message.name === "Success Rate"
                  ? newValue < 99
                    ? "critical"
                    : newValue < 99.5
                      ? "warning"
                      : "normal"
                  : newValue > 80
                    ? "critical"
                    : newValue > 60
                      ? "warning"
                      : "normal",
          }
        }),
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [])

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

      if (response.action === "optimize") {
        setMessages((prev) =>
          prev.map((m) => ({
            ...m,
            value: m.name === "Error Rate" ? Math.max(0.1, m.value * 0.3) : Math.max(20, m.value * 0.75),
            status: "normal",
            trend: "down",
          })),
        )
      } else if (response.action === "resolve_alerts") {
        setAlerts((prev) => prev.map((a) => ({ ...a, resolved: true })))
      } else if (response.action === "boost_performance") {
        setMessages((prev) =>
          prev.map((m) => (m.name === "Request Rate" ? { ...m, value: m.value * 1.3, trend: "up" } : m)),
        )
      }
    }, 1200)
  }

  const generateAIResponse = (input: string): { message: string; action?: string } => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("optimize") || lowerInput.includes("improve") || lowerInput.includes("performance")) {
      return {
        message:
          "Initiating network optimization... Reducing P95 latency, optimizing TCP connections, and improving packet transmission efficiency. Monitoring real-time improvements across all metrics.",
        action: "optimize",
      }
    }

    if (lowerInput.includes("alert") || lowerInput.includes("warning") || lowerInput.includes("error")) {
      return {
        message:
          "Analyzing network alerts... TCP retransmission issues resolved, latency spikes mitigated. All critical network alerts cleared.",
        action: "resolve_alerts",
      }
    }

    if (lowerInput.includes("network") || lowerInput.includes("latency") || lowerInput.includes("tcp")) {
      return {
        message: `Network health analysis: NHI (Network Health Index): ${healthIndices.nhi}%, THI (Transaction Health Index): ${healthIndices.thi}%. Current P95 latency: ${monitoringData[monitoringData.length - 1]?.rtt}ms, Packet loss: ${monitoringData[monitoringData.length - 1]?.loss}%`,
      }
    }

    if (lowerInput.includes("status") || lowerInput.includes("monitor") || lowerInput.includes("health")) {
      const latest = monitoringData[monitoringData.length - 1]
      return {
        message: `System status overview: Request rate: ${latest?.req} rps, Success rate: ${latest?.successRate}%, P95 response time: ${latest?.respP95}ms, Error rate: ${latest?.errorRate}%. Network and transaction health indices are being monitored continuously.`,
      }
    }

    return {
      message:
        "I'm monitoring your network and application performance in real-time. I can help with latency analysis, TCP optimization, packet loss investigation, connection management, and performance tuning. What would you like to focus on?",
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-emerald-600"
      case "warning":
        return "text-amber-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-slate-600"
    }
  }

  const getAlertIcon = (level: string, resolved: boolean) => {
    if (resolved) return <CheckCircle className="h-4 w-4 text-emerald-600" />
    switch (level) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      default:
        return <Activity className="h-4 w-4 text-primary" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-emerald-500" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default:
        return <div className="h-3 w-3 rounded-full bg-slate-400" />
    }
  }

  return (
    <div className="flex h-screen bg-background">
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
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
        <div className="p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Network className="h-7 w-7 text-primary" />
                Network Performance Monitoring Dashboard
              </h2>
              <p className="text-muted-foreground mt-1">
                Real-time network health and transaction performance monitoring
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-1 border rounded-lg text-sm bg-background"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="5m">5 minutes</option>
                <option value="15m">15 minutes</option>
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
              </select>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                Live
              </Badge>
              <Badge variant="outline" className="text-primary">
                Updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Network className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">NHI - Network Health Index</p>
                        <p className="text-xs text-muted-foreground">Latency, Loss, Retransmission</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-3xl font-bold text-${getHealthColor(healthIndices.nhi)}-600`}>
                        {healthIndices.nhi}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-full bg-${getHealthColor(healthIndices.nhi)}-500 rounded-full transition-all duration-500`}
                      style={{ width: `${healthIndices.nhi}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">THI - Transaction Health Index</p>
                        <p className="text-xs text-muted-foreground">Success Rate, Response Time, Errors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-3xl font-bold text-${getHealthColor(healthIndices.thi)}-600`}>
                        {healthIndices.thi}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-full bg-${getHealthColor(healthIndices.thi)}-500 rounded-full transition-all duration-500`}
                      style={{ width: `${healthIndices.thi}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    End-to-End Latency P95 (ms)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monitoringData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="rtt"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                          name="P95 RTT"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-primary" />
                    Packet Loss / TCP Retransmission (%)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monitoringData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" fontSize={12} />
                        <YAxis yAxisId="left" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" fontSize={12} />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="loss"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={false}
                          name="Packet Loss %"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="retrans"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={false}
                          name="Retransmission %"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-primary" />
                    Bandwidth & Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monitoringData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" fontSize={12} />
                        <YAxis yAxisId="left" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" fontSize={12} />
                        <Tooltip />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="inMbps"
                          stackId="1"
                          stroke="#60a5fa"
                          fill="#bfdbfe"
                          name="Inbound Mbps"
                        />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="outMbps"
                          stackId="1"
                          stroke="#818cf8"
                          fill="#c7d2fe"
                          name="Outbound Mbps"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="conn"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                          name="Connections"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Transaction Validation Area (KPI & Return Code Distribution)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {monitoringData[monitoringData.length - 1]?.req || 302}
                    </p>
                    <p className="text-sm text-muted-foreground">Request Rate (rps)</p>
                    <p className="text-xs text-emerald-600">Latest</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {monitoringData[monitoringData.length - 1]?.successRate.toFixed(2) || "99.70"}
                    </p>
                    <p className="text-sm text-muted-foreground">Success Rate (%)</p>
                    <p className="text-xs text-emerald-600">Latest</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {monitoringData[monitoringData.length - 1]?.respP95.toFixed(0) || 351}
                    </p>
                    <p className="text-sm text-muted-foreground">Response Time P95 (ms)</p>
                    <p className="text-xs text-emerald-600">Latest</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {monitoringData[monitoringData.length - 1]?.errorRate.toFixed(2) || "0.20"}
                    </p>
                    <p className="text-sm text-muted-foreground">Error Rate (5xx+timeout, %)</p>
                    <p className="text-xs text-emerald-600">Latest</p>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monitoringData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="codeSuccess" stackId="codes" name="Success" fill="#10b981" />
                      <Bar dataKey="code4xx" stackId="codes" name="4xx" fill="#f59e0b" />
                      <Bar dataKey="code5xx" stackId="codes" name="5xx" fill="#ef4444" />
                      <Bar dataKey="codeTimeout" stackId="codes" name="Timeout" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Success Rate vs Network Latency (Dual-Axis Diagnosis)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monitoringData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" fontSize={12} />
                        <YAxis yAxisId="left" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" fontSize={12} />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="successRate"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                          name="Success Rate %"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="rtt"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={false}
                          name="P95 RTT"
                        />
                        <ReferenceLine yAxisId="left" y={99.5} stroke="#0ea5e9" strokeDasharray="4 4" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Reading: Success rate decline + RTT increase → Network suspected; Success rate decline + RTT stable
                    → Application/dependency suspected.
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Response Time P95 vs Packet Loss (Scatter Diagnosis)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          type="number"
                          dataKey="loss"
                          name="Packet Loss %"
                          domain={[0, "dataMax + 0.5"]}
                          fontSize={12}
                        />
                        <YAxis type="number" dataKey="respP95" name="P95 Response (ms)" fontSize={12} />
                        <ZAxis
                          type="number"
                          dataKey="retrans"
                          range={[60, 200]}
                          name="Retransmission % (bubble size)"
                        />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter name="Time Points" data={monitoringData} fill="#ef4444" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Reading: Upper right quadrant indicates network transmission bottleneck; larger bubbles indicate
                    higher retransmission rates.
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Active Network Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border transition-all ${
                      alert.resolved ? "bg-muted/30 opacity-60" : "bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {alert.resolved ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : alert.level === "error" ? (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : alert.level === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Activity className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
