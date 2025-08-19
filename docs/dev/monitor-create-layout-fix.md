# Monitor Create Page Layout Fix

## Issue Description

在 `/monitor/create` 页面中，当显示预览模式（分屏布局）时，左右两侧在有滚动条时均不能正常使用。

### 具体问题

1. **左侧聊天区域太窄**：在分屏模式下，左侧聊天区域只有 25% 的宽度（`w-1/4`），这对于聊天界面来说太窄，特别是在有滚动条时会更加拥挤
2. **右侧预览区域滚动问题**：VisaPreview 组件的内容区域没有设置 `overflow-y-auto`，导致内容无法正常滚动
3. **布局高度计算问题**：布局没有正确处理高度分配和滚动容器

## 解决方案

### 1. 优化左侧聊天区域宽度

**修改前：**
```tsx
{/* Chat Area - 1/4 width */}
<div className="w-1/4 flex flex-col border-r border-border h-full">
```

**修改后：**
```tsx
{/* Chat Area - Improved width for better usability with responsive design */}
<div className="w-96 min-w-80 max-w-96 lg:min-w-96 flex flex-col border-r border-border h-full">
```

**改进点：**
- 使用固定宽度 `w-96` (384px) 替代百分比宽度 `w-1/4` (25%)
- 添加最小宽度 `min-w-80` (320px) 确保在小屏幕上的可用性
- 添加最大宽度 `max-w-96` (384px) 防止过宽
- 在大屏幕上使用 `lg:min-w-96` 确保足够的空间

### 2. 修复右侧预览区域滚动

**修改前：**
```tsx
{/* Preview Area - 3/4 width */}
<div className="flex-1 flex flex-col h-full">
  {previewType === "visa" && <VisaPreview className="flex-1" />}
  {previewType === "network" && <VisaPreview className="flex-1" />}
</div>
```

**修改后：**
```tsx
{/* Preview Area - Remaining width with proper overflow handling */}
<div className="flex-1 flex flex-col h-full overflow-hidden">
  {previewType === "visa" && <VisaPreview className="flex-1 overflow-hidden" />}
  {previewType === "network" && <VisaPreview className="flex-1 overflow-hidden" />}
</div>
```

### 3. 修复 VisaPreview 组件内部滚动

**修改前：**
```tsx
{/* Dashboard Content */}
<div className="flex-1 p-6">
```

**修改后：**
```tsx
{/* Dashboard Content - Added overflow-y-auto for proper scrolling */}
<div className="flex-1 overflow-y-auto p-6">
```

## 技术细节

### 布局结构

```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar (Fixed 48px)                                       │
├─────────────────────────────────────────────────────────────┤
│ Breadcrumb (Sticky)                                        │
├─────────────────────────────────────────────────────────────┤
│ Main Content (flex-1, overflow-hidden)                     │
│ ┌─────────────────┬─────────────────────────────────────────┐ │
│ │ Chat Area       │ Preview Area                            │ │
│ │ (384px fixed)   │ (flex-1, remaining space)              │ │
│ │ ┌─────────────┐ │ ┌─────────────────────────────────────┐ │ │
│ │ │ Messages    │ │ │ VisaPreview                         │ │ │
│ │ │ (scroll)    │ │ │ ┌─────────────────────────────────┐ │ │ │
│ │ └─────────────┘ │ │ │ Header (sticky)                 │ │ │ │
│ │ ┌─────────────┐ │ │ ├─────────────────────────────────┤ │ │ │
│ │ │ Input Area  │ │ │ │ Content (scroll)                │ │ │ │
│ │ └─────────────┘ │ │ └─────────────────────────────────┘ │ │ │
│ └─────────────────┘ │ └─────────────────────────────────────┘ │ │
│                     │                                         │ │
└─────────────────────┴─────────────────────────────────────────┘
```

### 关键 CSS 类说明

- `overflow-hidden`: 防止内容溢出，确保滚动在正确的容器内发生
- `overflow-y-auto`: 允许垂直滚动，当内容超出容器高度时显示滚动条
- `flex-1`: 占用剩余的可用空间
- `h-full`: 使用父容器的完整高度

## 响应式设计考虑

- **小屏幕** (`< lg`): 最小宽度 320px，确保聊天区域可用
- **大屏幕** (`>= lg`): 最小宽度 384px，提供更好的用户体验
- **最大宽度限制**: 384px，防止聊天区域过宽影响预览区域

## 测试验证

### 测试场景

1. **正常滚动测试**
   - 左侧聊天区域：消息较多时能正常滚动
   - 右侧预览区域：仪表板内容能正常滚动

2. **响应式测试**
   - 不同屏幕尺寸下的布局表现
   - 滚动条出现时的空间分配

3. **交互测试**
   - 聊天输入和发送功能
   - 预览区域的控件交互

### 验证方法

1. 访问 `http://localhost:3001/monitor/create`
2. 发送多条消息触发聊天区域滚动
3. 在预览模式下检查右侧内容滚动
4. 调整浏览器窗口大小测试响应式行为

## 文件修改清单

1. **app/monitor/create/page.tsx**
   - 修改聊天区域宽度设置
   - 添加预览区域溢出控制

2. **components/shared/VisaPreview.tsx**
   - 添加内容区域滚动支持

## 兼容性

- ✅ 现代浏览器 (Chrome, Firefox, Safari, Edge)
- ✅ 移动端浏览器
- ✅ 不同屏幕尺寸
- ✅ 深色/浅色主题

## 性能影响

- **无性能影响**: 纯 CSS 布局修改
- **改进用户体验**: 更好的滚动行为和空间利用
- **响应式友好**: 适配不同设备尺寸
