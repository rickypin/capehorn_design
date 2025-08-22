"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"
import VisaPreview from "@/components/shared/VisaPreview"
import PreviewHeader from "@/components/shared/PreviewHeader"
import MonitorCard, { MonitorCardData } from "@/components/shared/MonitorCard"
import Sidebar from "@/components/shared/Sidebar"
import Breadcrumb, { BREADCRUMB_CONFIGS } from "@/components/shared/Breadcrumb"
import { ResizableSplitPane } from "@/components/ui/resizable"

// Custom hook for responsive layout detection with proper cleanup
function useResponsiveLayout(
  elementRef: React.RefObject<HTMLElement | null>,
  threshold: number = 400,
  enabled: boolean = true
) {
  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      if (elementRef.current) {
        const width = elementRef.current.offsetWidth
        setIsCompact(width <= threshold)
      }
    }

    if (!enabled || !elementRef.current) return

    // Initial check
    checkWidth()

    // Set up ResizeObserver for precise container size detection
    let resizeObserver: ResizeObserver | null = null
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(checkWidth)
      resizeObserver.observe(elementRef.current)
    }

    // Fallback: window resize listener
    window.addEventListener('resize', checkWidth, { passive: true })

    return () => {
      window.removeEventListener('resize', checkWidth)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [elementRef, threshold, enabled])

  return isCompact
}

// Message interface for chat functionality
interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

// Component to format message content with proper styling
const FormattedMessage = ({
  content,
  isUser,
  onCardClick,
  visaServiceMonitor,
  networkPriorityMonitor
}: {
  content: string;
  isUser: boolean;
  onCardClick?: (monitor: MonitorCardData) => void;
  visaServiceMonitor: MonitorCardData;
  networkPriorityMonitor: MonitorCardData;
}) => {
  // Split content by lines and format accordingly
  const lines = content.split('\n')

  // Check if this is the VISA response or network admin response to show the card placeholder
  const isVisaResponse = content.includes('VISA Service Performance Monitoring') && content.includes('Click the mini card below and preview')
  const isNetworkAdminResponse = content.includes('network administrator') && content.includes('Network-Priority') && content.includes('Click the mini card below and preview')

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        // Handle section dividers
        if (line.trim() === '⸻') {
          return <div key={index} className="border-t border-border/30 my-4" />
        }

        // Handle main headings (starting with **)
        if (line.startsWith('**') && line.endsWith('**')) {
          const text = line.slice(2, -2)
          return (
            <h3 key={index} className={`font-semibold text-base mt-4 mb-2 ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
              {text}
            </h3>
          )
        }

        // Handle numbered sections
        if (/^\d+\.\s/.test(line.trim())) {
          return (
            <h4 key={index} className={`font-medium text-sm mt-3 mb-1 ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
              {line.trim()}
            </h4>
          )
        }

        // Handle bullet points
        if (line.startsWith('•')) {
          return (
            <div key={index} className={`ml-4 text-sm ${isUser ? 'text-primary-foreground/90' : 'text-foreground/90'}`}>
              {line}
            </div>
          )
        }

        // Handle arrows (→)
        if (line.includes('→')) {
          return (
            <div key={index} className={`ml-6 text-xs ${isUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {line}
            </div>
          )
        }

        // Handle empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-2" />
        }

        // Regular text
        return (
          <p key={index} className={`text-sm leading-relaxed ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
            {line}
          </p>
        )
      })}

      {/* Add card placeholder for VISA response */}
      {isVisaResponse && (
        <div className="mt-6">
          <MonitorCard
            monitor={visaServiceMonitor}
            onClick={onCardClick}
            className="max-w-xs"
            showPreview={true}
          />
        </div>
      )}

      {/* Add card placeholder for Network Admin response */}
      {isNetworkAdminResponse && (
        <div className="mt-6">
          <MonitorCard
            monitor={networkPriorityMonitor}
            onClick={onCardClick}
            className="max-w-xs"
            showPreview={true}
          />
        </div>
      )}
    </div>
  )
}

export default function NewMonitorPage() {
  const router = useRouter()
  const [activeNavItem, setActiveNavItem] = useState("Monitor")

  // Preview mode state
  const [showPreview, setShowPreview] = useState(false)
  const [previewType, setPreviewType] = useState<string | null>(null)

  // Preview controls state
  const [isSimulatedData, setIsSimulatedData] = useState(false)
  const [scenario, setScenario] = useState("normal")

  // Chat state management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant for creating and configuring monitors. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Use custom hook for responsive layout detection
  const isCompactLayout = useResponsiveLayout(chatContainerRef, 400, showPreview)

  // Monitor card data definitions
  const visaServiceMonitor: MonitorCardData = {
    id: "visa-service",
    name: "VISA Service Monitor",
    status: "preview",
    description: "Network-focused monitoring",
    iconColor: "blue",
    statusColor: "blue",
    route: "visa_service",
    type: "network",
    showMetrics: true, // Show enhanced version to match Monitor page
  }

  const networkPriorityMonitor: MonitorCardData = {
    id: "network-priority",
    name: "Network-Priority Monitor",
    status: "preview",
    description: "Transaction-focused monitoring",
    iconColor: "orange",
    statusColor: "orange",
    route: "visa_service_intermediate",
    type: "transaction",
    showMetrics: true, // Show enhanced version to match Monitor page
  }

  // Suggestion chips for different monitor types
  const suggestionChips = [
    {
      id: "visa",
      label: "VISA Service Performance Monitor",
      description: "Comprehensive VISA transaction and network monitoring",
      prompt: "Monitoring VISA Service Performance"
    },
    {
      id: "network-admin",
      label: "Network-Priority Monitor",
      description: "Network administrator focused monitoring approach",
      prompt: "I am a network administrator, I care more about whether network faults occur when issues arise."
    },
    {
      id: "database",
      label: "Database Performance Monitor",
      description: "Monitor database queries, connections, and performance",
      prompt: "I need to create a database performance monitor to track query performance, connection pools, and storage usage."
    },
    {
      id: "infrastructure",
      label: "Infrastructure Resource Monitor",
      description: "Monitor CPU, memory, disk, and system resources",
      prompt: "Create an infrastructure monitor to track CPU usage, memory consumption, disk space, and system performance metrics."
    }
  ]

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-scroll to bottom when layout changes to preview mode
  useEffect(() => {
    if (showPreview) {
      // Multiple attempts to ensure scrolling works after layout change
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }

      // Immediate scroll
      scrollToBottom()

      // Delayed scroll to handle layout transitions
      setTimeout(scrollToBottom, 100)
      setTimeout(scrollToBottom, 300)
    }
  }, [showPreview])



  // Handle sending messages
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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(currentInput),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle mini card click to show preview
  const handleCardClick = (monitor: MonitorCardData) => {
    setShowPreview(true)
    setPreviewType(monitor.id === "visa-service" ? "visa" : "network")
  }

  // Handle closing the preview
  const handleClosePreview = () => {
    setShowPreview(false)
    setPreviewType(null)
  }

  // Handle suggestion chip click
  const handleSuggestionClick = (prompt: string) => {
    setInputValue(prompt)
    // Auto-send the suggestion
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: prompt,
        sender: "user",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInputValue("")

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(prompt),
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }, 1000)
    }, 100)
  }

  // Simple AI response generator
  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    // Special case for network administrator priority
    if ((lowerInput.includes("network administrator") || lowerInput.includes("network admin")) &&
        (lowerInput.includes("network fault") || lowerInput.includes("network issue") || lowerInput.includes("care more about"))) {
      return `Understood, as a network administrator, your priority is: when VISA service issues occur, quickly determine whether the problem lies in the network layer.

So, we must put "is the network at fault" as the first priority, not the transaction logic.

⸻

**Goal-Oriented Monitoring Design**

When VISA errors or performance degradation happen, you must be able to answer immediately:

→ "Is it a network issue, or is it an application issue?"

Therefore, the dashboard should highlight network metrics → transaction metrics correlation.

⸻

**Core Metric Combinations (Network-Priority)**

**1. Latency & Success Rate Correlation**
• **End-to-End Latency** (RTT or TCP latency)
• **Transaction Success Rate**
→ Latency increases + success rate drops → likely network issue
→ Latency normal but success rate drops → likely VISA application layer issue

⸻

**2. Packet Loss / Retransmission & Response Time**
• **Packet Loss Rate + Retransmission Rate**
• **Average Response Time / P95 Response Time**
→ High packet loss + high retransmission + rising response time → network bottleneck
→ Rising response time but normal packet loss/retransmission → application processing delay

⸻

**3. Bitrate / Connection Count vs Request Count**
• **Inbound/Outbound Bitrate**
• **Concurrent Connections**
• **Transaction Request Count**
→ Bitrate spikes but request count unchanged → abnormal traffic (attack or routing anomaly)
→ Connection count rises but transactions fail → link congestion or handshake failures

⸻

**Dashboard Structure (Network-Priority)**
1. **Network Health Section (Top)**
• Latency trends
• Packet loss & retransmission
• Bitrate / concurrent connections

2. **Transaction Validation Section (Supporting)**
• Transaction success rate
• Average/tail response time
• Return code distribution (focus on 504/timeout vs 5xx)

3. **Correlation Analysis Section**
• Success rate vs network latency
• Response time vs packet loss

⸻

**Quick Interpretation (Network Admin Checklist)**
• Network all green, but transactions failing → VISA application issue
• Network latency/packet loss abnormal, transactions also failing → network issue
• Network metrics spike but transaction volume stable → abnormal traffic / attack / cross-border link problem

Feel free to suggest improvements.

**Click the mini card below and preview**`
    }

    // Special case for VISA Service Performance monitoring
    if (lowerInput.includes("monitoring visa service performance") ||
        (lowerInput.includes("visa") && lowerInput.includes("service") && lowerInput.includes("performance"))) {
      return `Alright, we will design a dashboard with the goal of "VISA Service Performance Monitoring."

Instead of simply listing metrics, I will provide a composite view that allows you to quickly determine whether an issue is caused by the network or by the transaction service, and to locate the problem efficiently.

⸻

**Dashboard Design Approach: Three-Layer Decomposition**

1. **Entry Health** (whether user requests successfully enter VISA)
2. **Transaction Processing Health** (whether VISA service processes normally)
3. **Network Transmission Health** (whether network issues cause performance degradation)

By combining these three layers of metrics, we can quickly distinguish:
• Is poor user experience due to network jitter?
• Or is it a bottleneck in VISA processing logic?
• Or is it an external dependency issue?

⸻

**Recommended Metric Combinations**

**1. Core Transaction Layer Health Metrics**
• **Transaction Request Count + Success Rate**
→ High request count + low success rate → service issue (possibly logic/dependency)
→ Low request count + normal success rate → low demand, not a fault

• **Average Response Time + Distribution (P95/P99)**
→ Normal average but high P99 → some transactions timing out, need to check long-tail latency

• **Return Code Distribution** (success codes vs error categories)
→ Can directly distinguish between system errors / user input issues / external dependency errors

⸻

**2. Supporting Network Layer Metrics**
• **End-to-End Network Latency + Packet Loss Rate + Retransmission Rate**
→ If transaction failure rate rises and packet loss/retransmission is high → network issue
→ If failure rate rises but network is healthy → check VISA transaction processing

• **Concurrent Connections vs Successful Transactions**
→ Spike in connections but transactions drop → possible traffic surge or DDoS risk

• **Bitrate Change vs Request Count Change**
→ Request count stable but bitrate spikes → abnormal packets or retransmission storm

⸻

**3. Cross-Layer Composite Views**
• **Success Rate × Network Latency**
→ Success rate drops + latency rises → network bottleneck
→ Success rate drops + latency normal → VISA internal issue

• **Response Time Distribution × Return Code Distribution**
→ Many 5xx errors + response time surge → VISA system slowdown
→ Many 4xx errors + stable response time → user input issue, not service outage

• **Transaction Volume × Packet Loss/Retransmission**
→ Transaction volume drops but packet loss rises → external link issue (possibly cross-border routing)

⸻

**Dashboard Presentation Suggestions**

A single large-screen dashboard divided into sections:
1. **Transaction Overview** (request count, success rate, response time distribution, top return code categories)
2. **Network Health** (latency, packet loss, retransmission, bitrate/connection trends)
3. **Correlation Diagnostics** (linked visualization: success rate vs latency, return codes vs response time)

This layout allows operations staff to determine issue ownership within 30 seconds:
• If network section is red → check the link first
• If transaction section is red but network is green → check VISA application layer
• If both are red → possible DDoS or external routing issue

⸻

If this does not meet expectations, feel free to suggest improvements.
**Click the mini card below and preview**`
    }

    // Context-aware responses based on user input
    if (lowerInput.includes("network") || lowerInput.includes("connection")) {
      return "Great choice! Network monitoring is essential. I can help you set up monitoring for network latency, packet loss, bandwidth usage, and connection health. What specific network metrics are you most interested in?"
    }

    if (lowerInput.includes("application") || lowerInput.includes("app") || lowerInput.includes("service")) {
      return "Application monitoring is crucial for maintaining service quality. I can guide you through setting up monitoring for response times, error rates, throughput, and availability. Which application or service would you like to monitor?"
    }

    if (lowerInput.includes("database") || lowerInput.includes("db")) {
      return "Database monitoring helps ensure optimal performance. We can monitor query performance, connection pools, storage usage, and replication lag. What type of database are you working with?"
    }

    // Default responses for general queries
    const responses = [
      "I can help you set up a new monitor. What type of service would you like to monitor?",
      "Great! Let me guide you through the monitor configuration process. What's the first step you'd like to focus on?",
      "I understand you want to create a monitor. Would you like to start with network monitoring, application monitoring, or something else?",
      "Perfect! I can assist with monitor setup. What specific metrics or services are you interested in tracking?",
      "That's a good question! For monitor creation, I recommend starting with defining your monitoring objectives. What would you like to achieve?",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
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
        <Breadcrumb items={BREADCRUMB_CONFIGS.monitorCreate()} />

        {/* Main Content - Chat Interface or Resizable Split Layout */}
        <div className="flex-1 flex bg-background overflow-hidden">
          {showPreview ? (
            <ResizableSplitPane
              defaultLeftWidth={480} // Default 480px to accommodate monitor cards (320px + padding)
              minLeftWidth={360}     // Minimum 360px
              maxLeftWidth={800}     // Maximum 800px
              leftPanel={
                <div
                  ref={chatContainerRef}
                  className={`flex flex-col h-full chat-layout-responsive ${
                    isCompactLayout ? 'chat-compact-mode' : ''
                  }`}
                  title={`Chat Layout: ${isCompactLayout ? 'Compact' : 'Default'}`}
                >
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex gap-2 ${message.sender === "user" ? "justify-end" : ""}`}>
                        {message.sender === "ai" && (
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div className={`max-w-[85%] ${message.sender === "user" ? "order-first" : ""}`}>
                          <Card
                            className={`${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-card"
                            } shadow-sm`}
                          >
                            <CardContent className="p-3">
                              <FormattedMessage
                                content={message.content}
                                isUser={message.sender === "user"}
                                onCardClick={handleCardClick}
                                visaServiceMonitor={visaServiceMonitor}
                                networkPriorityMonitor={networkPriorityMonitor}
                              />
                            </CardContent>
                          </Card>
                        </div>

                        {message.sender === "user" && (
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                              <User className="h-3 w-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Area */}
                <div className="border-t border-border bg-card p-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about the monitor..."
                      className="flex-1 min-h-[40px] max-h-[120px] resize-none text-sm"
                      rows={1}
                    />
                    <Button onClick={handleSendMessage} size="sm" className="px-3 self-end">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                </div>
              }
              rightPanel={
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Preview Header Bar */}
                  <PreviewHeader
                    isSimulatedData={isSimulatedData}
                    onSimulatedDataChange={setIsSimulatedData}
                    scenario={scenario}
                    onScenarioChange={setScenario}
                    onClose={handleClosePreview}
                  />

                  {/* Preview Content */}
                  {previewType === "visa" && (
                    <VisaPreview
                      className="flex-1 overflow-hidden"
                      hideDataControls={true}
                      isSimulatedData={isSimulatedData}
                      scenario={scenario}
                    />
                  )}
                  {previewType === "network" && (
                    <VisaPreview
                      className="flex-1 overflow-hidden"
                      hideDataControls={true}
                      isSimulatedData={isSimulatedData}
                      scenario={scenario}
                    />
                  )}
                </div>
              }
            />
          ) : (
            /* Full Width Chat Interface */
            <div className="flex-1 flex flex-col">

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "justify-end" : ""}`}>
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[70%] ${message.sender === "user" ? "order-first" : ""}`}>
                    <Card
                      className={`${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card"
                      } shadow-sm`}
                    >
                      <CardContent className="p-4">
                        <FormattedMessage
                          content={message.content}
                          isUser={message.sender === "user"}
                          onCardClick={handleCardClick}
                          visaServiceMonitor={visaServiceMonitor}
                          networkPriorityMonitor={networkPriorityMonitor}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-gradient-to-r from-card to-card/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto p-6">
              {/* Suggestion Chips */}
              {messages.length <= 1 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Quick Start Options:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestionChips.map((chip) => (
                      <button
                        key={chip.id}
                        onClick={() => handleSuggestionClick(chip.prompt)}
                        className="group p-4 text-left rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {chip.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors">
                          {chip.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Input Bar */}
              <div className="relative">
                <div className="flex gap-3 p-4 rounded-lg border-2 border-border bg-background shadow-lg hover:border-primary/30 focus-within:border-primary/50 transition-all duration-200">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Describe the monitor you want to create, or ask any questions about monitoring setup..."
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-h-[60px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/70"
                    rows={2}
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="lg"
                    className="px-6 self-end shadow-md hover:shadow-lg transition-all duration-200"
                    disabled={!inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
