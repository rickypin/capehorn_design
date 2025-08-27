import { defineEventHandler, createError, getRouterParam } from "h3"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id")

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Monitor ID is required",
      })
    }

    // In a real application, this would fetch from a database
    // For now, return mock data based on ID
    const monitor = {
      id,
      name: `Monitor ${id}`,
      status: "active",
      lastUpdated: "5 minutes ago",
      type: "network",
      showMetrics: true,
      iconType: "monitor",
      statusColor: "green",
    }

    return {
      success: true,
      data: monitor,
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch monitor",
    })
  }
})
