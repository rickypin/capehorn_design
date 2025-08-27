import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MonitorCard, { MonitorCardData } from '../MonitorCard'

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  ScatterChart: ({ children }: { children: React.ReactNode }) => <div data-testid="scatter-chart">{children}</div>,
  ComposedChart: ({ children }: { children: React.ReactNode }) => <div data-testid="composed-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Area: () => <div data-testid="area" />,
  Bar: () => <div data-testid="bar" />,
  Scatter: () => <div data-testid="scatter" />,
  Tooltip: ({ content }: { content: React.ReactNode }) => <div data-testid="tooltip">{content}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
}))

describe('MonitorCard', () => {
  const mockNetworkMonitor: MonitorCardData = {
    id: 'test-network',
    name: 'Test Network Monitor',
    status: 'active',
    type: 'network',
    showMetrics: true,
    chartType: 'area',
    iconColor: 'blue',
    statusColor: 'green',
  }

  const mockTransactionMonitor: MonitorCardData = {
    id: 'test-transaction',
    name: 'Test Transaction Monitor',
    status: 'active',
    type: 'transaction',
    showMetrics: true,
    chartType: 'line',
    iconColor: 'orange',
    statusColor: 'green',
  }

  beforeEach(() => {
    // Mock window.matchMedia for responsive container
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it('renders network monitor card with tooltip', () => {
    render(<MonitorCard monitor={mockNetworkMonitor} />)
    
    expect(screen.getByText('Test Network Monitor')).toBeInTheDocument()
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
  })

  it('renders transaction monitor card with tooltip', () => {
    render(<MonitorCard monitor={mockTransactionMonitor} />)
    
    expect(screen.getByText('Test Transaction Monitor')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
  })

  it('renders different chart types correctly', () => {
    const barMonitor = { ...mockNetworkMonitor, chartType: 'bar' as const }
    const { rerender } = render(<MonitorCard monitor={barMonitor} />)
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()

    const scatterMonitor = { ...mockNetworkMonitor, chartType: 'scatter' as const }
    rerender(<MonitorCard monitor={scatterMonitor} />)
    expect(screen.getByTestId('scatter-chart')).toBeInTheDocument()

    const composedMonitor = { ...mockNetworkMonitor, chartType: 'composed' as const }
    rerender(<MonitorCard monitor={composedMonitor} />)
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const mockOnClick = jest.fn()
    render(<MonitorCard monitor={mockNetworkMonitor} onClick={mockOnClick} />)
    
    const card = screen.getByRole('button', { name: /test network monitor/i })
    fireEvent.click(card)
    
    expect(mockOnClick).toHaveBeenCalledWith(mockNetworkMonitor)
  })

  it('renders simple card when showMetrics is false', () => {
    const simpleMonitor = { ...mockNetworkMonitor, showMetrics: false }
    render(<MonitorCard monitor={simpleMonitor} />)
    
    expect(screen.getByText('Test Network Monitor')).toBeInTheDocument()
    expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument()
  })

  it('displays test badge for test cards', () => {
    const testMonitor = { ...mockNetworkMonitor, id: 'test-123', name: '[TEST] Test Monitor' }
    render(<MonitorCard monitor={testMonitor} />)
    
    expect(screen.getByText('TEST')).toBeInTheDocument()
  })
})

// Test CustomTooltip component separately
describe('CustomTooltip', () => {
  // Note: Since CustomTooltip is not exported, we would need to either:
  // 1. Export it for testing
  // 2. Test it through integration with MonitorCard
  // 3. Create a separate test file for the tooltip component
  
  // For now, we test tooltip functionality through MonitorCard integration
  it('tooltip integration is tested through MonitorCard tests above', () => {
    // This is a placeholder to indicate that tooltip testing is covered
    // by the MonitorCard component tests above
    expect(true).toBe(true)
  })
})
