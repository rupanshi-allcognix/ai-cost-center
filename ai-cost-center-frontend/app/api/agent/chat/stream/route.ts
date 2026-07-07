import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const services = [{ name: 'EC2', cost: 1200, currency: 'USD', change_pct: 5.2 }, { name: 'S3', cost: 300, currency: 'USD', change_pct: -1.1 }]
      const total = services.reduce((s, x) => s + x.cost, 0)
      const obj = { services, total, anomalies: [] as { service: string; severity: string; delta: number }[] }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'object', value: obj })}\n\n`))
      await new Promise((r) => setTimeout(r, 100))
      services[0].cost += 50
      obj.anomalies.push({ service: 'EC2', severity: 'medium', delta: 50 })
      obj.total = services.reduce((s, x) => s + x.cost, 0)
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'partial', value: obj })}\n\n`))
      await new Promise((r) => setTimeout(r, 100))
      services[1].cost += 5
      obj.total = services.reduce((s, x) => s + x.cost, 0)
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'partial', value: obj })}\n\n`))
      await new Promise((r) => setTimeout(r, 100))
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
      controller.close()
    },
  })
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
}
