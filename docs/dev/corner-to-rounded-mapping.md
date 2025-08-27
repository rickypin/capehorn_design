# Corner到Rounded精确映射表

## 概述
本文档定义了从corner-系统到Tailwind rounded类的精确映射关系，确保UI效果完全一致。

## 精确映射表

| Corner类 | Corner值 | Tailwind类 | Tailwind值 | 匹配状态 |
|---------|----------|------------|------------|----------|
| `corner-xs` | 0.25rem (4px) | `rounded` | 0.25rem (4px) | ✅ 完全匹配 |
| `corner-sm` | 0.5rem (8px) | `rounded-lg` | 0.5rem (8px) | ✅ 完全匹配 |
| `corner-md` | 0.75rem (12px) | `rounded-xl` | 0.75rem (12px) | ✅ 完全匹配 |
| `corner-lg` | 1rem (16px) | `rounded-2xl` | 1rem (16px) | ✅ 完全匹配 |
| `corner-full` | 9999px | `rounded-full` | 9999px | ✅ 完全匹配 |

## 实际使用情况分析

### 使用频率统计
- `corner-xs`: 在button.tsx, badge.tsx, MonitorCard.tsx等中使用
- `corner-sm`: 在card.tsx, MonitorCard.tsx, VisaPreview.tsx等中使用  
- `corner-full`: 在switch.tsx, avatar.tsx, progress.tsx等中使用

### 未使用的corner类
以下corner类在项目中未被使用，无需映射：
- `corner-none`
- `corner-lg-plus` 
- `corner-xl`
- `corner-xl-plus`
- `corner-2xl`

## 替换规则

### 简单替换
\`\`\`bash
corner-xs → rounded
corner-sm → rounded-lg  
corner-full → rounded-full
\`\`\`

### 需要注意的文件
1. **components/ui/button.tsx**: 多处使用corner-xs
2. **components/ui/card.tsx**: 使用corner-sm
3. **components/shared/MonitorCard.tsx**: 混合使用corner-xs和corner-sm
4. **components/shared/VisaPreview.tsx**: 使用corner-sm和corner-full

## 验证清单

### UI组件验证
- [ ] Button组件圆角效果
- [ ] Card组件圆角效果  
- [ ] Badge组件圆角效果
- [ ] Avatar组件圆角效果
- [ ] Switch组件圆角效果
- [ ] Progress组件圆角效果
- [ ] Textarea组件圆角效果

### 页面验证
- [ ] Monitor页面
- [ ] Monitor Create页面
- [ ] Card Demo页面

### 特殊组件验证
- [ ] MonitorCard组件
- [ ] VisaPreview组件

## 注意事项

1. **完全匹配**: 所有映射都是像素级完全匹配，不会有视觉差异
2. **无需自定义**: 不需要添加任何自定义CSS
3. **标准化**: 使用Tailwind标准类，获得完整工具支持
