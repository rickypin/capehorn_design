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

export type DataPattern = 'normal' | 'spike' | 'step' | 'oscillating' | 'declining' | 'recovering' |
  'sawtooth' | 'exponential' | 'logarithmic' | 'random-walk' | 'heartbeat' | 'cascade' | 'pulse-burst'

// Generate time series data with specific patterns for different chart types
export function generateMiniCardDataWithPattern(
  type: 'network' | 'transaction',
  pattern: DataPattern = 'normal'
): MonitorDataPoint[] {
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

    // Apply pattern-specific modifications
    const progress = (minutes - i) / minutes // 0 to 1

    switch (pattern) {
      case 'spike':
        // Create a spike in the middle
        if (i >= 6 && i <= 9) {
          baseReq *= 2.5
          baseRtt *= 1.8
          baseSuccessRate -= 2
        }
        break

      case 'step':
        // Step function - higher values in second half
        if (i <= 7) {
          baseReq *= 1.6
          baseInMbps *= 1.4
          baseRtt *= 1.3
        }
        break

      case 'oscillating':
        // Sine wave pattern
        const oscillation = Math.sin(i * 0.8) * 0.4
        baseReq += baseReq * oscillation
        baseInMbps += baseInMbps * oscillation
        baseRtt += baseRtt * Math.abs(oscillation)
        break

      case 'declining':
        // Gradual decline
        const decline = progress * 0.6
        baseReq *= (1 - decline)
        baseInMbps *= (1 - decline)
        baseSuccessRate -= decline * 2
        break

      case 'recovering':
        // Recovery pattern - bad start, improving
        const recovery = 1 - Math.exp(-progress * 3)
        baseSuccessRate = 97 + recovery * 2.7
        baseRtt = 200 - recovery * 80
        baseErrorRate = 2 - recovery * 1.8
        break

      case 'sawtooth':
        // Sawtooth wave pattern
        const sawtooth = (progress * 4) % 1
        baseReq += baseReq * sawtooth * 0.8
        baseInMbps += baseInMbps * sawtooth * 0.6
        baseRtt += baseRtt * (1 - sawtooth) * 0.4
        break

      case 'exponential':
        // Exponential growth
        const exponential = Math.pow(progress, 2) * 2
        baseReq *= (1 + exponential)
        baseInMbps *= (1 + exponential * 0.5)
        baseRtt *= (1 + exponential * 0.3)
        break

      case 'logarithmic':
        // Logarithmic curve
        const logarithmic = Math.log(1 + progress * 9) / Math.log(10)
        baseReq *= (1 + logarithmic * 0.8)
        baseSuccessRate += logarithmic * 2
        baseRtt *= (1 - logarithmic * 0.2)
        break

      case 'random-walk':
        // Random walk pattern
        const randomWalk = Math.random() > 0.5 ? 1 : -1
        baseReq += baseReq * randomWalk * 0.3
        baseInMbps += baseInMbps * randomWalk * 0.2
        baseRtt += baseRtt * Math.abs(randomWalk) * 0.1
        break

      case 'heartbeat':
        // Heartbeat pattern - double peaks
        const heartbeat = Math.sin(i * 1.2) + 0.5 * Math.sin(i * 2.4)
        baseReq += baseReq * heartbeat * 0.4
        baseInMbps += baseInMbps * heartbeat * 0.3
        baseRtt += baseRtt * Math.abs(heartbeat) * 0.2
        break

      case 'cascade':
        // Cascade pattern - step-down
        const cascade = Math.floor(progress * 4) / 4
        baseReq *= (1 - cascade * 0.6)
        baseSuccessRate -= cascade * 3
        baseRtt += cascade * 50
        break

      case 'pulse-burst':
        // Pulse burst pattern - rhythmic bursts with varying intensity
        const pulseFreq = Math.sin(i * 0.8) * Math.sin(i * 0.3)
        const burstIntensity = Math.abs(Math.sin(i * 0.5)) * 2
        const baseline = 0.3 + Math.sin(i * 0.1) * 0.2

        baseReq *= (baseline + pulseFreq * burstIntensity)
        baseInMbps *= (baseline + pulseFreq * burstIntensity * 0.7)
        baseRtt += Math.abs(pulseFreq) * burstIntensity * 30
        baseSuccessRate -= Math.abs(pulseFreq) * burstIntensity * 0.5
        break

      default: // 'normal'
        // Standard variation
        const timeVariation = Math.sin(i * 0.3) * 0.2
        if (type === 'network') {
          baseInMbps += timeVariation * 50
          baseOutMbps += timeVariation * 30
        } else {
          baseReq += timeVariation * 100
        }
        break
    }

    // Add some noise
    const noise = () => (Math.random() - 0.5) * 0.1

    data.push({
      ts,
      time,
      rtt: +Math.max(10, baseRtt + baseRtt * noise()).toFixed(2),
      loss: +Math.max(0, baseLoss + baseLoss * noise()).toFixed(2),
      retrans: +Math.max(0, baseRetrans + baseRetrans * noise()).toFixed(2),
      inMbps: +Math.max(10, baseInMbps + baseInMbps * noise()).toFixed(2),
      outMbps: +Math.max(10, baseOutMbps + baseOutMbps * noise()).toFixed(2),
      req: Math.round(Math.max(50, baseReq + baseReq * noise())),
      successRate: +Math.min(100, Math.max(95, baseSuccessRate + baseSuccessRate * noise() * 0.1)).toFixed(2),
      respP95: +Math.max(50, baseRespP95 + baseRespP95 * noise()).toFixed(2),
      errorRate: +Math.max(0, baseErrorRate + baseErrorRate * noise()).toFixed(2),
    })
  }

  return data
}

// Generate time series data for the last 15 minutes (backward compatibility)
export function generateMiniCardData(type: 'network' | 'transaction'): MonitorDataPoint[] {
  return generateMiniCardDataWithPattern(type, 'normal')
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

  return +((rttScore + lossScore + retransScore) / 3).toFixed(2)
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

  return +((successScore + respScore + errorScore) / 3).toFixed(2)
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
