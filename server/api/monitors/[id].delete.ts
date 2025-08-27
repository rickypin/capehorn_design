import { defineEventHandler, createError } from "h3"
import { getRouterParam } from "#utils/router"

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id")

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Monitor ID is required",
      })
    }

    // In a real application, this would delete from a database

    return {
      success: true,
      message: "Monitor deleted successfully",
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete monitor",
    })
  }
})
