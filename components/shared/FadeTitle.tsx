"use client"

import { useEffect, useRef, useState } from "react"

interface FadeTitleProps {
  children: string
  className?: string
}

/**
 * FadeTitle 组件
 * 
 * 功能：
 * - 检测文本是否超出容器宽度
 * - 对于长标题，应用右侧渐隐效果提示内容被截断
 * - 响应式：窗口大小变化时自动重新检测
 */
export default function FadeTitle({
  children,
  className = ""
}: FadeTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !textRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const textWidth = textRef.current.scrollWidth
      setIsOverflowing(textWidth > containerWidth)
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [children])

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
      <div
        ref={textRef}
        className="whitespace-nowrap"
      >
        {children}
      </div>
    </div>
  )
}
