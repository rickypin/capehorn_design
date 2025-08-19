"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send,
  Bot,
  User,
  ChevronLeft,
  ChevronRight,
  Shield,
  Monitor as MonitorIcon,
  Home,
  Sparkles,
  MessageSquare,
  Plus,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function NewMonitorPage() {
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [activeNavItem, setActiveNavItem] = useState("Monitor")
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI Network Monitor assistant. I can help you create and configure network monitoring solutions. What would you like to monitor today?",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you want to ${inputValue.toLowerCase()}. I can help you set up monitoring for various network services including VISA payment processing, API endpoints, database connections, and more. Would you like me to create a specific monitoring configuration?`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedPrompts = [
    "Monitor VISA payment processing",
    "Set up API endpoint monitoring",
    "Create database performance monitor",
    "Monitor network latency and throughput"
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Left Navigation Sidebar */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar with Breadcrumb */}
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
                New Monitor
              </span>
            </nav>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-foreground rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts (show when no user messages) */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start"
                    onClick={() => setInputValue(prompt)}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{prompt}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-background/50 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe what you want to monitor..."
                  className="pr-14 h-12 text-base bg-white border-border/50 shadow-sm focus:shadow-md transition-all duration-200 rounded-xl"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-2 h-8 w-8 p-0 rounded-lg bg-primary hover:bg-primary/90 transition-colors duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
