"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ResizableSplitPaneProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  defaultLeftWidth?: number // in pixels
  minLeftWidth?: number // in pixels
  maxLeftWidth?: number // in pixels
  className?: string
}

export function ResizableSplitPane({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 480, // Default to 480px to accommodate monitor cards (320px + padding)
  minLeftWidth = 360, // Minimum 360px
  maxLeftWidth = 800, // Maximum 800px
  className
}: ResizableSplitPaneProps) {
  const [leftWidth, setLeftWidth] = React.useState(defaultLeftWidth)
  const [isDragging, setIsDragging] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newLeftWidth = e.clientX - containerRect.left

      // Apply constraints
      const constrainedWidth = Math.max(
        minLeftWidth,
        Math.min(maxLeftWidth, newLeftWidth)
      )

      setLeftWidth(constrainedWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, minLeftWidth, maxLeftWidth])

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full w-full overflow-hidden", className)}
    >
      {/* Left Panel */}
      <div
        className="flex flex-col border-r border-border h-full overflow-hidden"
        style={{ width: `${leftWidth}px` }}
      >
        {leftPanel}
      </div>

      {/* Resize Handle */}
      <div
        className={cn(
          "w-1 bg-border hover:bg-primary/20 cursor-col-resize transition-colors relative group",
          isDragging && "bg-primary/30"
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Visual handle indicator */}
        <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-primary/10 transition-colors" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {rightPanel}
      </div>
    </div>
  )
}
