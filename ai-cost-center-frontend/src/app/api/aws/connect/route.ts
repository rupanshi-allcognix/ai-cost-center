import { NextRequest } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/aws/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
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
