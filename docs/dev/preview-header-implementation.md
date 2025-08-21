# Preview Header Implementation

## Overview
Added a new preview header bar component that appears above the preview area in the monitor creation page. This header contains the preview title, data toggle switches, and a close button.

## Components Added

### PreviewHeader Component
**Location**: `components/shared/PreviewHeader.tsx`

**Features**:
- Left side: "Preview" title
- Right side: Data toggle switches (Real Data ↔ Simulated Data) and close button
- Compact design with smaller controls to fit in the narrow header bar
- Scenario selector appears only when simulated data is enabled

**Props**:
- `isSimulatedData`: boolean - Current state of data toggle
- `onSimulatedDataChange`: function - Handler for data toggle changes
- `scenario`: string - Current scenario selection
- `onScenarioChange`: function - Handler for scenario changes
- `onClose`: function - Handler for close button click

## Implementation Details

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb Navigation                                       │
├─────────────────────────────────────────────────────────────┤
│ Chat Area                    │ Preview Header Bar           │
│                              │ ┌─────────────────────────┐  │
│                              │ │ Preview  [Toggle] [X]   │  │
│                              │ └─────────────────────────┘  │
│                              │ Monitor Board Header        │
│                              │ ┌─────────────────────────┐  │
│                              │ │ 🌐 VISA Service... [⏰] │  │
│                              │ └─────────────────────────┘  │
│                              │ Dashboard Content           │
│                              │                             │
└─────────────────────────────────────────────────────────────┘
```

### State Management
Added new state variables in `app/monitor/create/page.tsx`:
- `isSimulatedData`: Controls the data toggle switch
- `scenario`: Controls the scenario selection when simulated data is enabled

### Integration Points
1. **PreviewHeader**: Positioned at the top of the right panel
2. **VisaPreview**: Modified to:
   - Hide only data controls (`hideDataControls={true}`) while preserving the monitor board header
   - Keep the original VISA Service Performance Monitor title and time range selector
   - Accept external control props for data toggle and scenario
   - Maintain full functionality with external state management

### Key Changes Made
- **Added `hideDataControls` prop** to VisaPreview component instead of using `hideHeader`
- **Preserved monitor board identity**: The original "🌐 VISA Service Performance Monitor" title remains visible
- **Kept time range controls**: Users can still select time ranges (Last 5 min, 15 min, 1 hour, 4 hours)
- **Maintained status badges**: Health status indicators are still displayed
- **Moved only data toggles**: Only the Real Data ↔ Simulated Data controls moved to PreviewHeader

### User Experience
- **Compact Design**: Header bar is narrow to maximize preview content space
- **Consistent Controls**: Same toggle switches as the original VisaPreview header
- **Easy Access**: Close button (X) allows quick dismissal of preview
- **Responsive**: Maintains functionality across different screen sizes

## Usage
The preview header automatically appears when a monitor card is clicked and preview mode is activated. Users can:
1. Toggle between real and simulated data
2. Select different scenarios when simulated data is enabled
3. Close the preview using the X button

## Technical Notes
- Uses Tailwind CSS for styling with Context7 best practices
- Maintains type safety with TypeScript interfaces
- Follows the existing component patterns in the codebase
- No breaking changes to existing functionality
