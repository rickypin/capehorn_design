// Monitor data generation utilities for mini cards

export interface MonitorDataPoint {
  ts: number
  time: string
  // Network metrics
  rtt: number
  loss: number
  retrans: number
  inMbps: number
  outMbps: number
  // Transaction metrics
  req: number
  successRate: number
  respP95: number
  errorRate: number
}

// Generate time series data for the last 15 minutes
export function generateMiniCardData(type: 'network' | 'transaction'): MonitorDataPoint[] {
  const now = Date.now()
  const data: MonitorDataPoint[] = []
  const minutes = 15

  for (let i = minutes; i >= 0; i--) {
    const ts = now - i * 60 * 1000
    const time = new Date(ts).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    // Base values
    let baseRtt = 120
    let baseLoss = 0.1
    let baseRetrans = 1.0
    let baseInMbps = 180
    let baseOutMbps = 120
    let baseReq = 300
    let baseSuccessRate = 99.7
    let baseRespP95 = 350
    let baseErrorRate = 0.2

    // Add some realistic variation
    const noise = () => (Math.random() - 0.5) * 0.1
    const timeVariation = Math.sin(i * 0.3) * 0.2 // Simulate daily patterns

    if (type === 'network') {
      // Network-focused variations
      baseInMbps += timeVariation * 50
      baseOutMbps += timeVariation * 30
      baseRtt += Math.random() * 20
      baseLoss += Math.random() * 0.05
    } else {
      // Transaction-focused variations
      baseReq += timeVariation * 100
      baseSuccessRate -= Math.random() * 0.3
      baseRespP95 += Math.random() * 50
    }

    data.push({
      ts,
      time,
      rtt: Math.max(10, baseRtt + baseRtt * noise()),
      loss: Math.max(0, baseLoss + baseLoss * noise()),
      retrans: Math.max(0, baseRetrans + baseRetrans * noise()),
      inMbps: Math.max(10, baseInMbps + baseInMbps * noise()),
      outMbps: Math.max(10, baseOutMbps + baseOutMbps * noise()),
      req: Math.max(50, baseReq + baseReq * noise()),
      successRate: Math.min(100, Math.max(95, baseSuccessRate + baseSuccessRate * noise() * 0.1)),
      respP95: Math.max(50, baseRespP95 + baseRespP95 * noise()),
      errorRate: Math.max(0, baseErrorRate + baseErrorRate * noise()),
    })
  }

  return data
}

// Calculate Network Health Indicator
export function calculateNHI(points: MonitorDataPoint[]): number {
  if (!points.length) return 0
  
  const avgRtt = points.reduce((sum, p) => sum + p.rtt, 0) / points.length
  const avgLoss = points.reduce((sum, p) => sum + p.loss, 0) / points.length
  const avgRetrans = points.reduce((sum, p) => sum + p.retrans, 0) / points.length

  const rttScore = Math.max(0, 100 - (avgRtt - 100) * 0.5)
  const lossScore = Math.max(0, 100 - avgLoss * 20)
  const retransScore = Math.max(0, 100 - avgRetrans * 10)

  return Math.round((rttScore + lossScore + retransScore) / 3)
}

// Calculate Transaction Health Indicator
export function calculateTHI(points: MonitorDataPoint[]): number {
  if (!points.length) return 0
  
  const avgSuccessRate = points.reduce((sum, p) => sum + p.successRate, 0) / points.length
  const avgRespP95 = points.reduce((sum, p) => sum + p.respP95, 0) / points.length
  const avgErrorRate = points.reduce((sum, p) => sum + p.errorRate, 0) / points.length

  const successScore = avgSuccessRate
  const respScore = Math.max(0, 100 - (avgRespP95 - 200) * 0.1)
  const errorScore = Math.max(0, 100 - avgErrorRate * 10)

  return Math.round((successScore + respScore + errorScore) / 3)
}

// Get health indicator color
export function getHealthColor(value: number): string {
  if (value >= 80) return "text-green-700 dark:text-green-600"
  if (value >= 60) return "text-amber-700 dark:text-amber-600"
  return "text-red-700 dark:text-red-600"
}

// Get health indicator background color
export function getHealthBgColor(value: number): string {
  if (value >= 80) return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
  if (value >= 60) return "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
  return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
}
