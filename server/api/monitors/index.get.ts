import { defineEventHandler, createError } from "h3"

export default defineEventHandler(async (event) => {
  try {
    // In a real application, this would fetch from a database
    // For now, return sample data that matches the store structure
    const monitors = [
      {
        id: "1",
        name: "VISA Service",
        status: "active",
        lastUpdated: "2 minutes ago",
        route: "visa_service",
        type: "network",
        showMetrics: true,
        iconType: "credit-card",
        statusColor: "green",
      },
      {
        id: "2",
        name: "VISA Service (Intermediate)",
        status: "active",
        lastUpdated: "5 minutes ago",
        route: "visa_service_intermediate",
        type: "transaction",
        showMetrics: true,
        iconType: "credit-card",
        statusColor: "green",
      },
      {
        id: "test-3",
        name: "[TEST] Payment Gateway Service",
        status: "active",
        lastUpdated: "1 minute ago",
        route: "payment_gateway_test",
        type: "network",
        showMetrics: true,
        iconType: "zap",
        statusColor: "green",
        description: "Gradient Area - Traffic Flow",
        chartType: "gradient-area",
        dataPattern: "sawtooth",
        chartStyle: {
          strokeWidth: 3,
          opacity: 0.8,
          glow: true,
        },
      },
      {
        id: "test-4",
        name: "[TEST] Auth Service",
        status: "warning",
        lastUpdated: "3 minutes ago",
        route: "auth_service_test",
        type: "transaction",
        showMetrics: true,
        iconType: "shield",
        statusColor: "orange",
        description: "Multi-Line - Performance Metrics",
        chartType: "multi-line",
        dataPattern: "heartbeat",
        chartStyle: {
          strokeWidth: 2,
          opacity: 0.9,
        },
      },
    ]

    return {
      success: true,
      data: monitors,
      total: monitors.length,
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch monitors",
    })
  }
})
