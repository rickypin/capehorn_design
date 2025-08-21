# Card Demo Page Documentation

## 概述

创建了一个临时演示页面 `/card-demo`，用于展示和说明项目中的三种Card组件。

## 页面位置

- **路径**: `/app/card-demo/page.tsx`
- **访问URL**: `http://localhost:3000/card-demo`
- **导航**: 侧边栏中的 Layers 图标

## 展示内容

### 1. 基础UI Card系统
- **组件路径**: `components/ui/card.tsx`
- **展示内容**:
  - 基础Card使用
  - 带操作按钮的Card
  - 完整结构的Card（包含Footer）
- **特性说明**:
  - 自动cursor检测
  - 完整组件族（7个组件）
  - 设计系统集成
  - 响应式设计

### 2. MonitorCard组件
- **组件路径**: `components/shared/MonitorCard.tsx`
- **展示内容**:
  - VISA Service监控卡片
  - Database Monitor监控卡片
- **特性说明**:
  - 8种图表类型支持
  - NHI/THI健康指标
  - 智能图标选择
  - 测试模式支持
  - 多种数据模式

### 3. Visa Board Card组件 (Legacy - 已移除)
- **组件路径**: ~~`visa_board.jsx`~~ (已删除)
- **展示内容**:
  - 简单卡片 (现在通过演示页面中的简化实现展示)
  - 带额外内容的卡片
  - 数据展示卡片
- **特性说明**:
  - 简化结构
  - 独立样式系统 (使用 `rounded-2xl`)
  - 轻量级实现
  - **注意**: 原文件已删除，功能已迁移到现代化的 `VisaPreview.tsx` 组件

## 对比表格

页面包含一个详细的对比表格，展示三种Card组件在以下方面的差异：
- 复杂度
- 用途
- 图表支持
- 健康指标
- 设计系统集成

## 交互功能

- **点击检测**: 点击任何卡片会显示选择信息
- **响应式布局**: 支持不同屏幕尺寸
- **实时演示**: 所有组件都是实际的可交互组件

## 技术实现

### 依赖组件
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import MonitorCard, { MonitorCardData } from "@/components/shared/MonitorCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
```

### 示例数据
```typescript
const sampleMonitors: MonitorCardData[] = [
  {
    id: "demo-1",
    name: "VISA Service",
    status: "active",
    type: "network",
    showMetrics: true,
    iconColor: "blue",
    statusColor: "green",
    description: "Payment processing service",
    chartType: "area",
    dataPattern: "normal"
  },
  // ...
]
```

### Visa Board Card实现
为了演示目的，在页面中重新实现了简化版的Visa Board Card组件：

```typescript
const VisaBoardCard = ({ title, extra, children, className = "" }) => (
  <div className={`rounded-2xl shadow-sm border border-gray-200 bg-white ${className}`}>
    {(title || extra) && (
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="font-medium text-gray-800">{title}</div>
        <div>{extra}</div>
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
)
```

## 导航集成

在 `components/shared/Sidebar.tsx` 中添加了临时导航按钮：
- 图标: Layers
- 标题: Card Demo
- 路由: `/card-demo`

## 使用说明

1. 启动开发服务器
2. 点击侧边栏的 Layers 图标
3. 浏览三种不同的Card组件展示
4. 查看特性说明和对比表格
5. 点击卡片查看交互效果

## 清理说明

这是一个临时演示页面，在完成演示后可以：
1. 删除 `/app/card-demo/page.tsx`
2. 从 `components/shared/Sidebar.tsx` 中移除Card Demo导航
3. 删除此文档文件

## 总结

此演示页面成功展示了项目中三种Card组件的：
- 结构差异
- 功能特性
- 使用场景
- 技术实现

为开发团队提供了清晰的组件对比和使用指南。
