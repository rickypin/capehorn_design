"use client"

import { useEffect, useRef, useState } from "react"

interface ScrollingTitleProps {
  children: string
  className?: string
  speed?: number // pixels per second
  pauseDuration?: number // milliseconds to pause at left edge (default 1000ms = 1s)
  gap?: number // gap between end and start of title in pixels (default 60px)
}

export default function ScrollingTitle({
  children,
  className = "",
  speed = 40, // human-friendly default speed (px/s)
  pauseDuration = 1500, // 1.5 second pause at left edge
  gap = 60 // 60px gap between end and start
}: ScrollingTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)

  const [isOverflowing, setIsOverflowing] = useState(false)

  // Animation refs
  const rafIdRef = useRef<number | null>(null)
  const lastTsRef = useRef<number>(0)
  const offsetRef = useRef<number>(0)
  const phaseRef = useRef<'pause' | 'scroll'>('pause')
  const pauseUntilRef = useRef<number>(0)
  const cycleDistanceRef = useRef<number>(0)

  // Start or restart animation when dependencies change
  useEffect(() => {
    const cleanup = () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }

    const setup = () => {
      if (!containerRef.current || !measureRef.current || !scrollerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const textWidth = measureRef.current.scrollWidth
      const overflowing = textWidth > containerWidth
      setIsOverflowing(overflowing)

      // Reset transform
      scrollerRef.current.style.transform = `translateX(0px)`

      cleanup()

      if (!overflowing) return

      const cycleDistance = textWidth + gap
      cycleDistanceRef.current = cycleDistance

      // Initialize animation state
      offsetRef.current = 0
      phaseRef.current = 'pause'
      pauseUntilRef.current = performance.now() + pauseDuration
      lastTsRef.current = performance.now()

      const step = (ts: number) => {
        const el = scrollerRef.current
        if (!el) return

        if (phaseRef.current === 'pause') {
          if (ts < pauseUntilRef.current) {
            // remain paused
          } else {
            // enter scrolling phase
            phaseRef.current = 'scroll'
            lastTsRef.current = ts
          }
        } else {
          // scrolling phase
          const dt = ts - lastTsRef.current
          lastTsRef.current = ts

          // advance offset
          offsetRef.current += (speed * dt) / 1000 // px

          if (offsetRef.current >= cycleDistanceRef.current) {
            // loop back seamlessly and pause again at left edge
            offsetRef.current -= cycleDistanceRef.current
            phaseRef.current = 'pause'
            pauseUntilRef.current = ts + pauseDuration
          }
        }

        // apply transform
        el.style.transform = `translateX(${-offsetRef.current}px)`

        rafIdRef.current = requestAnimationFrame(step)
      }

      rafIdRef.current = requestAnimationFrame(step)
    }

    setup()
    window.addEventListener('resize', setup)
    return () => {
      window.removeEventListener('resize', setup)
      cleanup()
    }
  }, [children, speed, pauseDuration, gap])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        WebkitMaskImage: isOverflowing
          ? 'linear-gradient(to right, black 0%, black 80%, transparent 100%)'
          : 'none',
        maskImage: isOverflowing
          ? 'linear-gradient(to right, black 0%, black 80%, transparent 100%)'
          : 'none'
      }}
    >
      {/* Hidden element to measure original text width */}
      <div
        ref={measureRef}
        className="whitespace-nowrap absolute opacity-0 pointer-events-none"
        style={{ top: '-9999px' }}
      >
        {children}
      </div>

      <div
        ref={scrollerRef}
        className="whitespace-nowrap will-change-transform"
        style={{ transform: 'translateX(0px)' }}
      >
        {isOverflowing ? (
          // Repeat content for seamless loop
          <span>
            {children}
            <span style={{ display: 'inline-block', width: `${gap}px` }} />
            {children}
            <span style={{ display: 'inline-block', width: `${gap}px` }} />
            {children}
          </span>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
