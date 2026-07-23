import { NextRequest } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const startDate = searchParams.get('start_date') || undefined
  const endDate = searchParams.get('end_date') || undefined

  const params = new URLSearchParams()
  if (startDate) params.set('start_date', startDate)
  if (endDate) params.set('end_date', endDate)

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/aws/costs?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(60000),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return Response.json(data, { status: backendRes.status })
    }

    return Response.json(data)
  } catch {
    return Response.json(
      { detail: 'Backend is not running. Start it with docker-compose up.' },
      { status: 502 }
    )
  }
}
