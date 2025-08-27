import { defineEventHandler, getRouterParam, readBody, createError } from "h3"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id")
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Monitor ID is required",
      })
    }

    // In a real application, this would update in a database
    const updatedMonitor = {
      id,
      ...body,
      lastUpdated: "just now",
    }

    return {
      success: true,
      data: updatedMonitor,
      message: "Monitor updated successfully",
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update monitor",
    })
  }
})
