import { NextRequest } from 'next/server'

const nodes = ['ingestion_router', 'anomaly_detector', 'policy_checker', 'recommendation_gen']

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for (const n of nodes) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'node_start', node: n, content: `start ${n}`, metadata: { tokens: 0, cost_usd: 0, latency_ms: 10 } })}\n\n`))
        await new Promise((r) => setTimeout(r, 50))
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', node: n, content: `processed by ${n}`, metadata: { tokens: 1, cost_usd: 0.001, latency_ms: 5 } })}\n\n`))
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'node_end', node: n, content: `end ${n}`, metadata: { tokens: 1, cost_usd: 0.001, latency_ms: 5 } })}\n\n`))
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'final', node: 'final', content: 'Analysis complete. I found a $2,400 cost spike in us-east-1 driven by EC2 (+$1,800), Data Transfer (+$450), and RDS (+$150).', metadata: {} })}\n\n`))
      controller.close()
    },
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
}
