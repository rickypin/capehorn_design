# Props Interface Unification

## 概述

本文档解决代码审查中发现的Props接口不一致问题，建立统一的组件Props设计模式，提升开发体验和代码一致性。

**问题**: 相似组件使用不同的Props模式
- `Sidebar`: 使用回调函数
- `Breadcrumb`: 使用配置对象
- `MonitorCard`: 混合模式

**目标**: 建立一致的Props接口设计模式

---

## 🎯 统一设计原则

### 1. **事件处理统一化**
所有交互组件都应该使用一致的事件处理模式：

```typescript
// ✅ 统一的事件处理模式
interface ComponentProps {
  onAction?: (data: ActionData) => void
  onSelect?: (item: SelectableItem) => void
  onClick?: (event: ClickEvent) => void
}
```

### 2. **数据传递标准化**
配置数据应该使用一致的结构：

```typescript
// ✅ 统一的数据结构
interface ComponentProps {
  data: ComponentData        // 主要数据对象
  config?: ComponentConfig   // 可选配置
  className?: string         // 样式定制
}
```

### 3. **状态管理明确化**
明确区分受控和非受控组件：

```typescript
// ✅ 受控组件模式
interface ControlledProps {
  value: T
  onChange: (value: T) => void
}

// ✅ 非受控组件模式  
interface UncontrolledProps {
  defaultValue?: T
  onValueChange?: (value: T) => void
}
```

---

## 📋 组件重构方案

### 1. Sidebar组件重构

#### 当前问题
```typescript
// ❌ 当前不一致的接口
interface SidebarProps {
  activeNavItem?: string
  onNavItemChange?: (item: string) => void
}
```

#### 重构方案
```typescript
// ✅ 统一后的接口
interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType
  href?: string
  isActive?: boolean
}

interface SidebarProps {
  items: SidebarItem[]
  activeItem?: string
  onItemSelect?: (item: SidebarItem) => void
  onNavigate?: (href: string) => void
  className?: string
}
```

### 2. Breadcrumb组件重构

#### 当前状态
```typescript
// ✅ 已经相对合理，需要小幅调整
interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}
```

#### 重构方案
```typescript
// ✅ 增强后的接口
interface BreadcrumbItem {
  id?: string
  label: string
  href?: string
  isActive?: boolean
  icon?: React.ComponentType
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onItemClick?: (item: BreadcrumbItem) => void
  onNavigate?: (href: string) => void
  className?: string
}
```

### 3. MonitorCard组件重构

#### 当前问题
```typescript
// ❌ 混合模式，不够一致
interface MonitorCardProps {
  monitor: MonitorCardData
  onClick?: (monitor: MonitorCardData) => void
  className?: string
  showPreview?: boolean
}
```

#### 重构方案
```typescript
// ✅ 统一后的接口
interface MonitorCardProps {
  data: MonitorCardData
  config?: {
    showPreview?: boolean
    showMetrics?: boolean
    interactive?: boolean
  }
  onSelect?: (data: MonitorCardData) => void
  onNavigate?: (route: string) => void
  className?: string
}
```

---

## 🔧 实现策略

### 阶段1: 向后兼容重构
保持现有API的同时，添加新的统一接口：

```typescript
// 过渡期接口设计
interface SidebarProps {
  // 新的统一接口
  items?: SidebarItem[]
  onItemSelect?: (item: SidebarItem) => void
  
  // 保持向后兼容（标记为deprecated）
  /** @deprecated 使用 items 和 onItemSelect 替代 */
  activeNavItem?: string
  /** @deprecated 使用 items 和 onItemSelect 替代 */
  onNavItemChange?: (item: string) => void
}
```

### 阶段2: 逐步迁移
更新所有使用站点到新接口：

```typescript
// 旧用法
<Sidebar
  activeNavItem="Monitor"
  onNavItemChange={setActiveNavItem}
/>

// 新用法
<Sidebar
  items={sidebarItems}
  activeItem="Monitor"
  onItemSelect={handleItemSelect}
/>
```

### 阶段3: 清理旧接口
移除deprecated的props，完成统一化。

---

## 📚 统一模式指南

### 1. 命名约定
```typescript
// ✅ 统一的命名模式
interface ComponentProps {
  // 数据相关
  data: ComponentData      // 主要数据
  items: ItemType[]        // 列表数据
  config: ConfigType       // 配置选项
  
  // 事件相关
  onSelect: (item) => void    // 选择事件
  onClick: (event) => void    // 点击事件
  onNavigate: (path) => void  // 导航事件
  onChange: (value) => void   // 值变化事件
  
  // 状态相关
  isActive: boolean        // 激活状态
  isLoading: boolean       // 加载状态
  isDisabled: boolean      // 禁用状态
  
  // 样式相关
  className: string        // 自定义样式
  variant: VariantType     // 变体样式
  size: SizeType          // 尺寸规格
}
```

### 2. 事件处理模式
```typescript
// ✅ 统一的事件处理
const handleItemSelect = (item: SidebarItem) => {
  // 1. 更新本地状态
  setActiveItem(item.id)
  
  // 2. 调用父组件回调
  onItemSelect?.(item)
  
  // 3. 处理导航（如果需要）
  if (item.href) {
    onNavigate?.(item.href)
  }
}
```

### 3. 类型定义组织
```typescript
// ✅ 统一的类型定义结构
export interface ComponentData {
  id: string
  // ... 数据字段
}

export interface ComponentConfig {
  // ... 配置选项
}

export interface ComponentProps {
  data: ComponentData
  config?: ComponentConfig
  // ... 其他props
}

export type ComponentVariant = 'default' | 'primary' | 'secondary'
export type ComponentSize = 'sm' | 'md' | 'lg'
```

---

## ✅ 预期收益

### 1. 开发体验提升
- 一致的API设计，降低学习成本
- 统一的命名约定，提高代码可读性
- 标准化的事件处理，减少错误

### 2. 维护性改善
- 统一的模式，便于代码审查
- 一致的结构，简化重构工作
- 标准化的接口，提高可测试性

### 3. 扩展性增强
- 统一的设计模式，便于添加新组件
- 一致的架构，支持更好的组合
- 标准化的接口，提高复用性

---

## 📝 下一步行动

1. **实现Sidebar组件重构** - 添加新的统一接口
2. **增强Breadcrumb组件** - 添加事件处理回调
3. **重构MonitorCard组件** - 统一数据和事件处理模式
4. **更新使用站点** - 迁移到新的统一接口
5. **创建使用指南** - 为未来开发建立标准

通过这个统一化方案，我们将解决Props接口不一致的问题，建立清晰的组件设计标准。

---

## 🎉 实施结果

### 已完成的重构

#### 1. Sidebar组件 ✅
**新的统一接口**:
```typescript
interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  isActive?: boolean
  isDisabled?: boolean
}

interface SidebarProps {
  // 新的统一接口
  items?: SidebarItem[]
  activeItem?: string
  onItemSelect?: (item: SidebarItem) => void
  onNavigate?: (href: string) => void
  className?: string

  // 保持向后兼容的旧接口
  activeNavItem?: string
  onNavItemChange?: (item: string) => void
}
```

**使用示例**:
```typescript
// 新的统一接口使用方式
const sidebarItems: SidebarItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "monitor", label: "Monitor", icon: MonitorIcon, href: "/monitor" },
  { id: "settings", label: "Settings", icon: Settings, isDisabled: true }
]

<Sidebar
  items={sidebarItems}
  activeItem="monitor"
  onItemSelect={handleItemSelect}
  onNavigate={handleNavigate}
/>

// 旧接口仍然支持（向后兼容）
<Sidebar
  activeNavItem="Monitor"
  onNavItemChange={setActiveNavItem}
/>
```

#### 2. Breadcrumb组件 ✅
**增强的统一接口**:
```typescript
interface BreadcrumbItem {
  id?: string
  label: string
  href?: string
  isActive?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  onItemClick?: (item: BreadcrumbItem) => void
  onNavigate?: (href: string) => void
  className?: string
}
```

**使用示例**:
```typescript
<Breadcrumb
  items={[
    { id: "monitor", label: "Monitor", href: "/monitor", icon: MonitorIcon },
    { id: "visa", label: "VISA Service", isActive: true }
  ]}
  onItemClick={handleBreadcrumbClick}
  onNavigate={handleNavigate}
/>
```

#### 3. MonitorCard组件 ✅
**新的统一接口**:
```typescript
interface MonitorCardConfig {
  showPreview?: boolean
  showMetrics?: boolean
  interactive?: boolean
}

interface MonitorCardProps {
  // 新的统一接口
  data: MonitorCardData
  config?: MonitorCardConfig
  onSelect?: (data: MonitorCardData) => void
  onNavigate?: (route: string) => void
  className?: string

  // 保持向后兼容的旧接口
  monitor?: MonitorCardData
  onClick?: (monitor: MonitorCardData) => void
  showPreview?: boolean
}
```

**使用示例**:
```typescript
// 新的统一接口使用方式
<MonitorCard
  data={monitorData}
  config={{
    showPreview: false,
    showMetrics: true,
    interactive: true
  }}
  onSelect={handleMonitorSelect}
  onNavigate={handleNavigate}
/>

// 旧接口仍然支持（向后兼容）
<MonitorCard
  monitor={monitorData}
  onClick={handleMonitorClick}
  showPreview={false}
/>
```

---

## 📚 最佳实践指南

### 1. 新组件开发标准

当创建新的交互组件时，请遵循以下统一模式：

```typescript
// ✅ 标准的组件Props接口模式
interface ComponentItem {
  id: string
  label: string
  // ... 其他数据字段
}

interface ComponentConfig {
  // 可选的配置选项
}

interface ComponentProps {
  // 主要数据
  data?: ComponentData
  items?: ComponentItem[]

  // 配置选项
  config?: ComponentConfig

  // 事件处理
  onSelect?: (item: ComponentItem) => void
  onNavigate?: (path: string) => void
  onChange?: (value: any) => void

  // 状态控制
  activeItem?: string
  isLoading?: boolean
  isDisabled?: boolean

  // 样式定制
  className?: string
  variant?: ComponentVariant
  size?: ComponentSize
}
```

### 2. 事件处理统一模式

```typescript
// ✅ 统一的事件处理模式
const handleItemSelect = (item: ComponentItem) => {
  // 1. 更新本地状态
  setActiveItem(item.id)

  // 2. 调用父组件回调
  onSelect?.(item)

  // 3. 处理导航（如果需要）
  if (item.href) {
    onNavigate?.(item.href)
  }
}
```

### 3. 向后兼容策略

```typescript
// ✅ 向后兼容的实现模式
export default function Component({
  // 新的统一接口
  data,
  config,
  onSelect,

  // 旧接口（标记为deprecated）
  /** @deprecated Use data instead */
  legacyData,
  /** @deprecated Use onSelect instead */
  onClick
}: ComponentProps) {
  // 支持新旧接口
  const componentData = data || legacyData

  const handleAction = () => {
    // 新接口优先
    if (onSelect) {
      onSelect(componentData)
    }
    // 兼容旧接口
    else if (onClick) {
      onClick(componentData)
    }
  }

  // ...
}
```

---

## 🔄 迁移指南

### 从旧接口迁移到新接口

#### Sidebar组件迁移
```typescript
// 旧用法
<Sidebar
  activeNavItem="Monitor"
  onNavItemChange={setActiveNavItem}
/>

// 新用法
<Sidebar
  items={sidebarItems}
  activeItem="Monitor"
  onItemSelect={handleItemSelect}
/>
```

#### MonitorCard组件迁移
```typescript
// 旧用法
<MonitorCard
  monitor={monitorData}
  onClick={handleClick}
  showPreview={true}
/>

// 新用法
<MonitorCard
  data={monitorData}
  config={{ showPreview: true }}
  onSelect={handleSelect}
/>
```

### 迁移时间表

1. **立即可用**: 新接口已经实现并可以使用
2. **渐进迁移**: 旧接口继续支持，可以逐步迁移
3. **未来版本**: 计划在v2.0中移除deprecated的旧接口

---

## ✅ 验证和测试

### 组件接口一致性检查

所有重构的组件现在都遵循统一的模式：

1. **数据传递**: 使用 `data` 或 `items` 属性
2. **配置选项**: 使用 `config` 对象
3. **事件处理**: 使用 `onSelect`, `onNavigate` 等标准回调
4. **状态控制**: 使用 `activeItem`, `isLoading` 等标准状态属性
5. **样式定制**: 使用 `className`, `variant`, `size` 等标准样式属性

### 向后兼容性验证

- ✅ 所有现有使用站点继续正常工作
- ✅ 旧接口标记为deprecated但仍然功能完整
- ✅ 新接口提供更好的开发体验和一致性

---

## 🎯 总结

通过实施统一的Props接口模式，我们成功解决了代码审查中发现的组件接口不一致问题：

### 解决的问题
1. **事件处理不一致** - 现在所有组件都使用标准的回调模式
2. **数据传递混乱** - 统一使用 `data`/`items` + `config` 模式
3. **开发体验差异** - 建立了一致的组件使用模式

### 获得的收益
1. **开发效率提升** - 一致的API降低学习成本
2. **代码质量改善** - 标准化的接口提高可维护性
3. **扩展性增强** - 统一的模式便于添加新功能

### 未来发展
1. **持续改进** - 基于使用反馈继续优化接口设计
2. **标准推广** - 将统一模式应用到更多组件
3. **工具支持** - 考虑添加ESLint规则确保接口一致性

这个重构为项目建立了清晰的组件设计标准，为未来的开发工作奠定了坚实的基础。
