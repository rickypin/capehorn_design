# FadeTitle 组件

## 组件概述

FadeTitle 是一个简单可靠的文本显示组件，专门用于处理可能超出容器宽度的标题文本。

### 🎯 核心功能

- **溢出检测**：自动检测文本是否超出容器宽度
- **渐隐效果**：对于长标题，应用右侧渐隐效果提示内容被截断
- **响应式**：窗口大小变化时自动重新检测和调整

## 重命名历史

### 📝 从 ScrollingTitle 到 FadeTitle

**原因**：原 ScrollingTitle 组件名称与实际功能不符
- **之前**：ScrollingTitle（但实际没有滚动功能）
- **现在**：FadeTitle（准确描述渐隐效果）

**变更内容**：
- 重命名组件文件：`ScrollingTitle.tsx` → `FadeTitle.tsx`
- 更新组件名称：`ScrollingTitle` → `FadeTitle`
- 更新接口名称：`ScrollingTitleProps` → `FadeTitleProps`
- 更新所有引用（MonitorCard.tsx）

## API 接口

### Props

```typescript
interface FadeTitleProps {
  children: string      // 要显示的文本内容
  className?: string    // 可选的 CSS 类名
}
```

### 使用示例

```tsx
// 基本使用
<FadeTitle className="font-medium text-foreground">
  这是一个可能很长的标题文本
</FadeTitle>

// 在 MonitorCard 中的使用
<FadeTitle className="font-medium text-foreground text-sm mb-1">
  {monitor.name}
</FadeTitle>
```

## 技术实现

### 🔧 核心逻辑

```typescript
export default function FadeTitle({ children, className = "" }: FadeTitleProps) {
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
      <div ref={textRef} className="whitespace-nowrap">
        {children}
      </div>
    </div>
  )
}
```

### 🎨 视觉效果

- **短标题**：正常显示，无任何效果
- **长标题**：右侧 20% 区域平滑渐隐到透明
- **渐隐范围**：从 80% 位置开始渐隐到 100% 透明

## 优势特点

### ✅ 简单可靠

1. **轻量级**：仅 64 行代码，无复杂依赖
2. **高性能**：无动画开销，仅在需要时应用效果
3. **兼容性好**：CSS mask 属性有良好的浏览器支持
4. **零配置**：开箱即用，无需复杂参数

### ✅ 用户体验

1. **视觉清晰**：渐隐效果明确提示内容被截断
2. **无干扰**：静态显示不会分散用户注意力
3. **响应式**：自动适应容器大小变化

### ✅ 开发友好

1. **易于理解**：逻辑简单直观
2. **易于调试**：无复杂状态管理
3. **易于维护**：代码结构清晰
4. **易于扩展**：可轻松添加其他效果

## 使用场景

### 📍 当前使用

- **MonitorCard 组件**：显示监控项目名称
- **标题显示**：任何需要处理长标题的场景

### 🎯 适用场景

- 卡片标题
- 导航项目名称
- 列表项标题
- 任何固定宽度容器中的文本

## 清理工作

### 🗑️ 已删除的文件

1. **组件文件**：`components/shared/ScrollingTitle.tsx`
2. **文档文件**：
   - `docs/dev/scrolling-title-algorithm-redesign.md`
   - `docs/dev/scrolling-title-best-practices-fix.md`
   - `docs/dev/scrolling-title-final-fix.md`
   - `docs/dev/scrolling-title-simplified.md`
3. **测试页面**：
   - `app/test-scrolling/page.tsx`
   - `app/debug-scrolling/page.tsx`

### 🧹 已清理的代码

1. **CSS 注释**：移除了过时的 ScrollingTitle 相关注释
2. **导入引用**：更新了 MonitorCard.tsx 中的导入和使用

## 总结

FadeTitle 组件提供了一个简单、可靠、高性能的解决方案来处理长标题的显示问题。通过重命名和清理，我们获得了：

- ✅ **准确的命名**：组件名称与功能完全匹配
- ✅ **清洁的代码库**：移除了所有过时和无用的代码
- ✅ **简单的维护**：专注于核心功能，易于理解和维护
- ✅ **良好的用户体验**：提供清晰的视觉提示
