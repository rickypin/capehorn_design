# Mini Card 组件统一实现

## 概述

本文档记录了将 Monitor 页面和对话页面中的 mini card 组件统一为共用组件的实现过程。

## 问题描述

原先在两个不同的页面中存在重复的 mini card 实现：
1. **Monitor 页面** (`app/monitor/page.tsx`) - 显示监控器列表的 mini card
2. **对话页面** (`app/monitor/create/page.tsx`) - 在 AI 回复中显示的 mini card

这些 mini card 的代码是重复的，没有共用一个组件，导致维护困难。

## 解决方案

### 1. 创建共用的 MonitorCard 组件

创建了 `components/shared/MonitorCard.tsx` 组件，包含以下特性：

- **统一的数据接口** (`MonitorCardData`)
- **可配置的样式** (图标颜色、状态颜色)
- **灵活的显示模式** (预览模式 vs 正常模式)
- **统一的点击处理**

```typescript
export interface MonitorCardData {
  id: string
  name: string
  status: string
  lastUpdated?: string
  description?: string
  route?: string
  iconColor?: string
  statusColor?: string
}
```

### 2. 更新 Monitor 页面

- 导入 `MonitorCard` 组件和 `MonitorCardData` 接口
- 更新 monitors 数据类型为 `MonitorCardData[]`
- 替换原有的 Card 组件为 `MonitorCard` 组件
- 更新点击处理函数接受 `MonitorCardData` 参数

### 3. 更新对话页面

- 导入 `MonitorCard` 组件和 `MonitorCardData` 接口
- 定义两个 monitor 数据对象：
  - `visaServiceMonitor` - 对应 VISA Service
  - `networkPriorityMonitor` - 对应 VISA Service Intermediate
- 更新 `FormattedMessage` 组件接受 monitor 数据
- 替换原有的 Card 组件为 `MonitorCard` 组件

## Mini Card 对应关系

根据用户需求，建立了以下对应关系：

| 对话页面 Mini Card | Monitor 页面 Mini Card | 路由 |
|-------------------|----------------------|------|
| VISA Service Monitor | VISA Service | `/monitor/visa_service` |
| Network-Priority Monitor | VISA Service (Intermediate) | `/monitor/visa_service_intermediate` |

## 实现细节

### MonitorCard 组件特性

1. **图标颜色配置**：
   - `blue` (默认) - 蓝色主题
   - `orange` - 橙色主题

2. **状态颜色配置**：
   - `green` (默认) - 绿色状态点
   - `blue` - 蓝色状态点
   - `orange` - 橙色状态点

3. **显示模式**：
   - `showPreview={true}` - 显示 "Preview" 状态
   - `showPreview={false}` - 显示实际状态和更新时间

### 数据配置

**对话页面中的 monitor 数据：**

```typescript
const visaServiceMonitor: MonitorCardData = {
  id: "visa-service",
  name: "VISA Service Monitor",
  status: "preview",
  description: "Three-layer monitoring dashboard",
  iconColor: "blue",
  statusColor: "blue",
  route: "visa_service"
}

const networkPriorityMonitor: MonitorCardData = {
  id: "network-priority",
  name: "Network-Priority Monitor", 
  status: "preview",
  description: "Network-first monitoring dashboard",
  iconColor: "orange",
  statusColor: "orange",
  route: "visa_service_intermediate"
}
```

## 验证结果

✅ Monitor 页面正确显示统一的 mini card  
✅ 对话页面正确显示统一的 mini card  
✅ Mini card 对应关系正确建立  
✅ 点击跳转功能正常工作  

## 优势

1. **代码复用** - 消除了重复代码
2. **统一维护** - 只需在一个地方修改样式和逻辑
3. **类型安全** - 使用 TypeScript 接口确保数据一致性
4. **灵活配置** - 支持不同的颜色主题和显示模式
5. **易于扩展** - 新增 monitor 类型时只需配置数据

## Mini Card 增强功能 (2024-08-19)

### 新增功能

1. **时序图显示**：
   - VISA Service: 网络流量时序图 (Area Chart)
   - VISA Service Intermediate: 交易量时序图 (Line Chart)

2. **健康指标**：
   - Network Health Indicator (NHI) - 基于 RTT、丢包率、重传率
   - Transaction Health Indicator (THI) - 基于成功率、响应时间、错误率

3. **增强的 UI 设计**：
   - 渐变背景的图表区域
   - 圆角健康指标徽章
   - 图标化的指标标签
   - 深色模式支持

### 技术实现

**数据生成** (`lib/monitor-data.ts`):
```typescript
// 生成最近15分钟的模拟数据
generateMiniCardData(type: 'network' | 'transaction')

// 计算健康指标
calculateNHI(points) // 网络健康指标
calculateTHI(points) // 交易健康指标
```

**组件增强** (`components/shared/MonitorCard.tsx`):
- 条件渲染：`showMetrics=true` 时显示增强版本
- 响应式图表：使用 Recharts 库
- 健康指标徽章：动态颜色和样式

### 显示内容对比

| Monitor | 图表类型 | 数据指标 | 健康指标 | 颜色主题 |
|---------|----------|----------|----------|----------|
| VISA Service | Area Chart | 网络流量 (inMbps) | NHI | 蓝色 |
| VISA Service Intermediate | Line Chart | 交易量 (req) | THI | 橙色 |

### 配置示例

```typescript
// Monitor 页面配置
{
  id: "1",
  name: "VISA Service",
  type: "network",
  showMetrics: true,
  iconColor: "blue",
  statusColor: "green",
}

// 对话页面配置 (与 Monitor 页面保持一致)
{
  id: "visa-service",
  name: "VISA Service Monitor",
  type: "network",
  showMetrics: true, // 显示完整的增强内容
}
```

## Mini Card 样式统一 (2024-08-19)

### 最终统一

经过用户反馈，将对话页面中的 mini card 样式与 Monitor 页面完全统一：

**变更前**:
- Monitor 页面：显示增强版 mini card（时序图 + 健康指标）
- 对话页面：显示简化版 mini card（仅基本信息）

**变更后**:
- Monitor 页面：显示增强版 mini card ✅
- 对话页面：显示增强版 mini card ✅

**配置更新**:
```typescript
// 对话页面中的配置更新
const visaServiceMonitor: MonitorCardData = {
  // ... 其他配置
  showMetrics: true, // 从 false 改为 true
}

const networkPriorityMonitor: MonitorCardData = {
  // ... 其他配置
  showMetrics: true, // 从 false 改为 true
}
```

### 统一效果

现在两个页面的 mini card 完全一致：
- 🎯 **相同的视觉设计**：图表、健康指标、颜色主题
- 📊 **相同的数据展示**：15分钟时序图和健康指标
- 🔄 **真正的代码共享**：一处修改，两处生效

## 后续改进建议

1. 考虑将 monitor 数据移到全局状态管理中
2. 添加更多的图标和颜色主题选项
3. 支持自定义图标而不仅仅是 MonitorIcon
4. 添加加载状态和错误状态的显示
5. 支持实时数据更新和 WebSocket 连接
6. 添加更多图表类型（柱状图、散点图等）
7. 支持自定义时间范围（5分钟、30分钟、1小时等）
