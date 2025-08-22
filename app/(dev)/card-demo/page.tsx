"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import MonitorCard, { MonitorCardData } from "@/components/shared/MonitorCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Heart, 
  Activity, 
  TrendingUp,
  Database,
  Server,
  Network,
  CreditCard
} from "lucide-react"

// Visa Board Card Component (simplified version for demo)
const VisaBoardCard = ({ title, extra, children, className = "" }: {
  title?: string
  extra?: React.ReactNode
  children: React.ReactNode
  className?: string
}) => (
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

export default function CardDemoPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  // Sample MonitorCard data
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
    {
      id: "demo-2", 
      name: "Database Monitor",
      status: "warning",
      type: "transaction",
      showMetrics: true,
      iconColor: "orange",
      statusColor: "orange",
      description: "Database performance tracking",
      chartType: "line",
      dataPattern: "spike"
    }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Card Components Demo</h1>
          <p className="text-lg text-muted-foreground">
            项目中的三种Card组件展示与说明
          </p>
        </div>

        {/* Card Type 1: Basic UI Card System */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
              基础UI Card系统
            </h2>
            <p className="text-muted-foreground">
              <code className="bg-muted px-2 py-1 rounded text-sm">components/ui/card.tsx</code> - 
              完整的card组件族，包含7个相关组件，支持自动cursor-pointer检测
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Card */}
            <Card className="cursor-pointer" onClick={() => setSelectedCard('basic-1')}>
              <CardHeader>
                <CardTitle>基础Card</CardTitle>
                <CardDescription>最简单的card使用方式</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  这是一个基础的card组件，包含header和content区域。
                </p>
              </CardContent>
            </Card>

            {/* Card with Action */}
            <Card>
              <CardHeader>
                <CardTitle>带操作的Card</CardTitle>
                <CardAction>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </CardAction>
                <CardDescription>包含操作按钮的card</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">健康状态: 良好</span>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card with Footer */}
            <Card>
              <CardHeader>
                <CardTitle>完整结构Card</CardTitle>
                <CardDescription>包含所有组件的完整card</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CPU使用率</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="outline" size="sm" className="w-full">
                  查看详情
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">特性说明：</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>自动cursor检测</strong>: 有onClick或data-clickable时自动显示pointer</li>
              <li>• <strong>完整组件族</strong>: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter</li>
              <li>• <strong>设计系统集成</strong>: 使用rounded-lg圆角，支持主题色彩</li>
              <li>• <strong>响应式设计</strong>: 支持容器查询和响应式布局</li>
            </ul>
          </div>
        </section>

        {/* Card Type 2: MonitorCard Component */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
              MonitorCard组件
            </h2>
            <p className="text-muted-foreground">
              <code className="bg-muted px-2 py-1 rounded text-sm">components/shared/MonitorCard.tsx</code> - 
              专业的监控数据展示card，基于基础Card构建，支持多种图表和健康指标
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleMonitors.map((monitor) => (
              <MonitorCard
                key={monitor.id}
                data={monitor}
                config={{
                  showPreview: false,
                  showMetrics: true,
                  interactive: true
                }}
                onSelect={(data) => setSelectedCard(`monitor-${data.id}`)}
                onNavigate={(route) => console.log(`Navigate to: ${route}`)}
              />
            ))}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">特性说明：</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>多种图表类型</strong>: area, line, bar, scatter, composed等8种图表</li>
              <li>• <strong>健康指标</strong>: NHI/THI计算，动态颜色显示</li>
              <li>• <strong>智能图标</strong>: 根据服务名称自动选择合适图标</li>
              <li>• <strong>测试模式</strong>: 支持测试卡片标识和特殊样式</li>
              <li>• <strong>数据模式</strong>: 支持多种数据模式(normal, spike, sawtooth等)</li>
            </ul>
          </div>
        </section>

        {/* Card Type 3: Visa Board Card (Legacy) */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
              Visa Board Card组件 (Legacy)
            </h2>
            <p className="text-muted-foreground">
              <code className="bg-muted px-2 py-1 rounded text-sm line-through">visa_board.jsx</code> -
              原独立的简化card组件 (已删除)，功能已迁移到现代化的VisaPreview组件。以下为演示实现：
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VisaBoardCard title="简单卡片">
              <p className="text-gray-600 text-sm">
                这是一个简化的card组件，专门为visa board界面设计。
              </p>
            </VisaBoardCard>

            <VisaBoardCard 
              title="带额外内容" 
              extra={<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">NEW</span>}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700">实时监控</span>
                </div>
                <div className="text-xs text-gray-500">
                  支持标题和额外内容区域
                </div>
              </div>
            </VisaBoardCard>

            <VisaBoardCard title="数据展示">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">成功率</span>
                  <span className="text-sm font-medium text-green-600">99.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">响应时间</span>
                  <span className="text-sm font-medium text-blue-600">45ms</span>
                </div>
              </div>
            </VisaBoardCard>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">特性说明：</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>简化结构</strong>: 只包含标题、额外内容和主体区域</li>
              <li>• <strong>独立样式</strong>: 使用rounded-2xl和独立的颜色系统</li>
              <li>• <strong>轻量级</strong>: 最小化的依赖和功能</li>
              <li>• <strong>已废弃</strong>: 原文件已删除，功能已迁移到VisaPreview.tsx</li>
              <li>• <strong>演示目的</strong>: 上述卡片为演示实现，展示原设计思路</li>
            </ul>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">组件对比</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border p-3 text-left">特性</th>
                  <th className="border border-border p-3 text-left">基础UI Card</th>
                  <th className="border border-border p-3 text-left">MonitorCard</th>
                  <th className="border border-border p-3 text-left">Visa Board Card</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 font-medium">复杂度</td>
                  <td className="border border-border p-3">中等</td>
                  <td className="border border-border p-3">高</td>
                  <td className="border border-border p-3">低</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">用途</td>
                  <td className="border border-border p-3">通用UI组件</td>
                  <td className="border border-border p-3">监控数据展示</td>
                  <td className="border border-border p-3">Visa Board专用 (已废弃)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">图表支持</td>
                  <td className="border border-border p-3">❌</td>
                  <td className="border border-border p-3">✅ 8种图表类型</td>
                  <td className="border border-border p-3">❌ (已迁移)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">健康指标</td>
                  <td className="border border-border p-3">❌</td>
                  <td className="border border-border p-3">✅ NHI/THI</td>
                  <td className="border border-border p-3">❌ (已迁移)</td>
                </tr>
                <tr>
                  <td className="border border-border p-3 font-medium">设计系统集成</td>
                  <td className="border border-border p-3">✅ 完全集成</td>
                  <td className="border border-border p-3">✅ 基于基础Card</td>
                  <td className="border border-border p-3">❌ 独立样式 (已废弃)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Selected Card Info */}
        {selectedCard && (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
            <p className="text-sm">已选择: {selectedCard}</p>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setSelectedCard(null)}
              className="mt-2"
            >
              关闭
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
