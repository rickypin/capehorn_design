# Switch Implementation for VISA Service Monitor

## Overview
Successfully implemented a switch button to replace the scenario dropdown in the VISA Service Performance Monitor page. The new UI allows users to toggle between "Real Data" and "Simulated Data" modes.

## Changes Made

### 1. Created Switch Component
- **File**: `components/ui/switch.tsx`
- **Description**: Created a new Switch component using @radix-ui/react-switch
- **Features**: 
  - Accessible switch with proper focus states
  - Consistent styling with the design system
  - Smooth animations and transitions

### 2. Updated VisaPreview Component
- **File**: `components/shared/VisaPreview.tsx`
- **Changes**:
  - Added Switch component import
  - Added new state: `isSimulatedData` (boolean)
  - Updated i18n dictionary with new labels:
    - `realData`: "Real Data" / "真实数据"
    - `simulatedData`: "Simulated Data" / "模拟数据"
  - Replaced scenario dropdown with switch + conditional dropdown

### 3. New UI Behavior
- **Default State**: Switch is OFF (Real Data mode)
  - Shows "Real Data" on the left
  - Shows "Simulated Data" on the right
  - No dropdown is visible
  - Data uses "normal" scenario automatically

- **Simulated Data Mode**: Switch is ON
  - Dropdown appears on the right side
  - Contains all scenarios EXCEPT "Normal":
    - Scenario: Network Incident
    - Scenario: App/Dependency Incident  
    - Scenario: Cross-border Jitter
    - Scenario: Retransmission Storm

### 4. Data Logic Updates
- **Real Data Mode**: Always uses "normal" scenario regardless of previous selection
- **Simulated Data Mode**: Uses the selected scenario from dropdown
- **State Management**: When switching back to Real Data, scenario automatically resets to "normal"

## Technical Implementation

### Switch Component Structure
\`\`\`tsx
<div className="flex items-center gap-4">
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">{t("realData")}</span>
    <Switch 
      checked={isSimulatedData} 
      onCheckedChange={(checked) => {
        setIsSimulatedData(checked)
        if (!checked) {
          setScenario("normal")
        }
      }}
    />
    <span className="text-sm text-muted-foreground">{t("simulatedData")}</span>
  </div>
  
  {isSimulatedData && (
    <Select value={scenario} onValueChange={setScenario}>
      <SelectTrigger className="w-48 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="network">{t("scenario_network")}</SelectItem>
        <SelectItem value="app">{t("scenario_app")}</SelectItem>
        <SelectItem value="crossborder">{t("scenario_crossborder")}</SelectItem>
        <SelectItem value="retrans">{t("scenario_retrans")}</SelectItem>
      </SelectContent>
    </Select>
  )}
</div>
\`\`\`

### Data Generation Logic
\`\`\`tsx
const effectiveScenario = isSimulatedData ? scenario : "normal"
return genSeries({ minutes, scenario: effectiveScenario, tfmt })
\`\`\`

## User Experience
1. **Default View**: Users see "Real Data | Simulated Data" with switch in OFF position
2. **Toggle to Simulated**: Switch moves to ON position, dropdown appears with scenario options
3. **Select Scenario**: Users can choose from available simulation scenarios
4. **Toggle Back**: Switch returns to OFF, dropdown disappears, data returns to normal

## Recent Improvements (Latest Updates)

### 4. Time Range Layout Optimization
**Problem**: Time Range selector was positioned on the left side with a label, taking up valuable space
**Solution**:
- Moved Time Range selector to the right side of the header (right-aligned)
- Removed the "Time Range:" label to save space
- Updated all time range options to include "Last" prefix:
  - `last_5m`: "Last 5 min" / "最近 5 分钟"
  - `last_15m`: "Last 15 min" / "最近 15 分钟"
  - `last_1h`: "Last 1 hour" / "最近 1 小时"
  - `last_4h`: "Last 4 hours" / "最近 4 小时"
- Increased selector width to accommodate longer text

## Previous Improvements

### 1. Enhanced Switch Visual Design
**Problem**: Switch button was not visible enough when in the left (OFF) position
**Solution**:
- Improved contrast for unchecked state with `bg-slate-300` and `border-slate-400`
- Added hover effects for better interaction feedback
- Enhanced dark mode support with appropriate slate colors
- Added smooth transitions and better shadow effects

### 2. Fixed Default Value Display
**Problem**: When switching to "Simulated Data", dropdown showed empty value instead of default
**Solution**:
- Modified switch handler to automatically set scenario to "network" when enabling simulated data
- Ensures dropdown always shows a valid selection

### 3. Simplified Dropdown Labels
**Problem**: Dropdown options had redundant "Scenario:" prefix
**Solution**:
- Added new dictionary entries without prefixes:
  - `network_incident`: "Network Incident" / "网络异常"
  - `app_incident`: "App/Dependency Incident" / "应用异常"
  - `crossborder_jitter`: "Cross-border Jitter" / "跨境路由抖动"
  - `retrans_storm`: "Retransmission Storm" / "重传风暴"
- Updated dropdown to use simplified labels

## Testing
- ✅ Switch toggles correctly between states
- ✅ Switch is clearly visible in both ON and OFF positions
- ✅ Dropdown appears/disappears based on switch state
- ✅ Dropdown shows "Network Incident" as default when switching to simulated data
- ✅ All dropdown options display without "Scenario:" prefix
- ✅ Time Range selector is positioned on the right side
- ✅ Time Range options display with "Last" prefix (e.g., "Last 15 min")
- ✅ No "Time Range:" label is shown (clean, minimal design)
- ✅ Data generation respects the switch state
- ✅ Scenario resets to "normal" when returning to Real Data mode
- ✅ All scenario options work correctly in Simulated Data mode
- ✅ No TypeScript compilation errors
- ✅ Responsive design maintained
- ✅ Improved visual contrast and accessibility
- ✅ Header layout is well-balanced with controls on both sides

## Files Modified
1. `components/ui/switch.tsx` - New file
2. `components/shared/VisaPreview.tsx` - Updated with new UI logic

## Dependencies
- @radix-ui/react-switch (already installed in package.json)
