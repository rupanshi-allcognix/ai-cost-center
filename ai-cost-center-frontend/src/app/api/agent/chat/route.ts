import { NextRequest } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  const body = await req.json()

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    })

    if (!backendRes.ok) {
      throw new Error(`Backend returned ${backendRes.status}`)
    }

    return new Response(backendRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'final',
              node: 'final',
              content:
                'The backend AI agent is not running. Start it with `docker-compose up` and ensure your OPENAI_API_KEY is set in the .env file.',
              metadata: {
                reasoning:
                  'Backend connection failed. The LangGraph agent powered by GPT-4o-mini is required for AI responses. Start the backend with docker-compose up.',
                sources: [],
              },
            })}\n\n`,
          ),
        )
        controller.close()
      },
    })
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    })
  }
}
