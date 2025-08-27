import { defineStore } from "pinia"
import { $fetch } from "ofetch"

export interface ChatMessage {
  id: string
  type: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    monitorData?: any
    suggestions?: string[]
    error?: string
  }
}

export interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  currentInput: string
  sessionId: string | null
  context: {
    monitorType?: "network" | "transaction"
    currentStep?: string
    collectedData?: Record<string, any>
  }
}

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    messages: [],
    isTyping: false,
    currentInput: "",
    sessionId: null,
    context: {},
  }),

  getters: {
    getAllMessages: (state) => state.messages,
    getUserMessages: (state) => state.messages.filter((m) => m.type === "user"),
    getAssistantMessages: (state) => state.messages.filter((m) => m.type === "assistant"),
    getLastMessage: (state) => state.messages[state.messages.length - 1],
    isAssistantTyping: (state) => state.isTyping,
    getCurrentInput: (state) => state.currentInput,
    getContext: (state) => state.context,
    hasMessages: (state) => state.messages.length > 0,
  },

  actions: {
    setCurrentInput(input: string) {
      this.currentInput = input
    },

    setTyping(typing: boolean) {
      this.isTyping = typing
    },

    addMessage(message: Omit<ChatMessage, "id" | "timestamp">) {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      }
      this.messages.push(newMessage)
    },

    addUserMessage(content: string) {
      this.addMessage({
        type: "user",
        content,
      })
    },

    addAssistantMessage(content: string, metadata?: ChatMessage["metadata"]) {
      this.addMessage({
        type: "assistant",
        content,
        metadata,
      })
    },

    addSystemMessage(content: string) {
      this.addMessage({
        type: "system",
        content,
      })
    },

    updateContext(updates: Partial<ChatState["context"]>) {
      this.context = { ...this.context, ...updates }
    },

    setContext(context: ChatState["context"]) {
      this.context = context
    },

    clearMessages() {
      this.messages = []
    },

    clearContext() {
      this.context = {}
    },

    startNewSession() {
      this.sessionId = `session-${Date.now()}`
      this.clearMessages()
      this.clearContext()
      this.setCurrentInput("")
      this.setTyping(false)
    },

    async sendMessage(content: string) {
      // Add user message
      this.addUserMessage(content)
      this.setCurrentInput("")
      this.setTyping(true)

      try {
        const response = await $fetch("/api/chat", {
          method: "POST",
          body: {
            message: content,
            context: this.context,
            sessionId: this.sessionId,
          },
        })

        this.addAssistantMessage(response.data.response, {
          suggestions: response.data.suggestions,
        })

        // Update context with response data
        if (response.data.context) {
          this.updateContext(response.data.context)
        }
      } catch (error) {
        this.addAssistantMessage("Sorry, I encountered an error. Please try again.", {
          error: error instanceof Error ? error.message : "Unknown error",
        })
      } finally {
        this.setTyping(false)
      }
    },
  },
})
