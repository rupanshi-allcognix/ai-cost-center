import { NextRequest } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(_req: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/aws/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return Response.json(data, { status: backendRes.status })
    }

    return Response.json(data)
  } catch {
    return Response.json(
      { detail: 'Backend is not running.' },
      { status: 502 }
    )
  }
}
