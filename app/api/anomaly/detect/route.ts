import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// Simplified Z-score detection for standalone mode (no FastAPI needed)
function detectZscore(values: number[], threshold = 2.5) {
  if (values.length < 4) return []
  const mean = values.reduce((s, v) => s + v, 0) / values.length
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length
  const std = Math.sqrt(variance)
  if (std === 0) return []
  return values
    .map((v, i) => ({ index: i, value: v, z_score: parseFloat(Math.abs((v - mean) / std).toFixed(2)), severity: (Math.abs((v - mean) / std) > 3.5 ? 'critical' : 'warning') as 'critical' | 'warning' }))
    .filter((a) => a.z_score > threshold)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { values, threshold = 2.5 } = body

    if (!Array.isArray(values) || values.length < 4) {
      return NextResponse.json({ error: 'Need at least 4 data points' }, { status: 400 })
    }

    const anomalies = detectZscore(values, threshold)
    return NextResponse.json({ method: 'zscore', count: anomalies.length, anomalies })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
