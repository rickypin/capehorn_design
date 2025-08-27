import { defineEventHandler, readBody, createError } from "h3"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    if (!body.name || !body.type) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name and type are required",
      })
    }

    // In a real application, this would save to a database
    const newMonitor = {
      id: `monitor-${Date.now()}`,
      ...body,
      status: "active",
      lastUpdated: "just now",
      statusColor: "green",
    }

    return {
      success: true,
      data: newMonitor,
      message: "Monitor created successfully",
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create monitor",
    })
  }
})
